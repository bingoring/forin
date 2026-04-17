package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"math/rand"

	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

var (
	ErrGiftBoxNotFound    = errors.New("gift box not found")
	ErrGiftBoxNotOwned    = errors.New("gift box does not belong to user")
	ErrGiftBoxAlreadyOpen = errors.New("gift box already opened")
	ErrItemNotFound       = errors.New("item not found")
	ErrItemNotInShop      = errors.New("item not available in shop")
	ErrInsufficientCatnip = errors.New("insufficient catnip")
	ErrItemAlreadyOwned   = errors.New("item already owned")
	ErrItemNotOwned       = errors.New("item not owned")
)

const duplicateCatnipReward = 30

// Drop rates per box type: [common, uncommon, rare, epic, legendary]
var dropRates = map[string][]float64{
	"basic":     {0.60, 0.30, 0.09, 0.01, 0.00},
	"silver":    {0.30, 0.40, 0.20, 0.09, 0.01},
	"gold":      {0.10, 0.25, 0.35, 0.25, 0.05},
	"legendary": {0.00, 0.05, 0.20, 0.45, 0.30},
}

var rarityOrder = []string{"common", "uncommon", "rare", "epic", "legendary"}

type GamificationService struct {
	gamificationRepo GamificationRepository
	cfg              *config.Config
}

func NewGamificationService(repo GamificationRepository, cfg *config.Config) *GamificationService {
	return &GamificationService{gamificationRepo: repo, cfg: cfg}
}

// --- Inventory ---

func (s *GamificationService) GetInventory(ctx context.Context, userID uuid.UUID) (*dto.InventoryResponse, error) {
	items, err := s.gamificationRepo.FindUserInventory(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("find inventory: %w", err)
	}

	var resp []dto.InventoryItemResponse
	for _, inv := range items {
		resp = append(resp, dto.InventoryItemResponse{
			ID:           inv.Item.ID,
			Name:         inv.Item.Name,
			Slot:         inv.Item.Slot,
			Rarity:       inv.Item.Rarity,
			ImageURL:     inv.Item.ImageURL,
			IsEquipped:   inv.IsEquipped,
			AcquiredFrom: inv.AcquiredFrom,
			AcquiredAt:   inv.AcquiredAt,
		})
	}

	return &dto.InventoryResponse{Items: resp, TotalItems: len(resp)}, nil
}

// --- Gift Boxes ---

func (s *GamificationService) GetPendingGiftBoxes(ctx context.Context, userID uuid.UUID) (*dto.PendingGiftBoxesResponse, error) {
	boxes, err := s.gamificationRepo.FindPendingGiftBoxes(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("find pending boxes: %w", err)
	}

	var resp []dto.PendingGiftBox
	for _, b := range boxes {
		resp = append(resp, dto.PendingGiftBox{
			ID:       b.ID,
			BoxType:  b.BoxType,
			EarnedAt: b.OpenedAt,
		})
	}

	return &dto.PendingGiftBoxesResponse{PendingBoxes: resp, Count: len(resp)}, nil
}

func (s *GamificationService) OpenGiftBox(ctx context.Context, userID, boxID uuid.UUID) (*dto.OpenGiftBoxResponse, error) {
	box, err := s.gamificationRepo.FindGiftBoxByID(ctx, boxID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrGiftBoxNotFound
		}
		return nil, err
	}
	if box.UserID != userID {
		return nil, ErrGiftBoxNotOwned
	}
	if box.ItemID != nil {
		return nil, ErrGiftBoxAlreadyOpen
	}

	// Roll rarity
	rarity := rollRarity(box.BoxType)

	// Pick random item of that rarity
	items, err := s.gamificationRepo.FindItemsByRarity(ctx, rarity)
	if err != nil || len(items) == 0 {
		return nil, fmt.Errorf("no items of rarity %s", rarity)
	}
	item := items[rand.Intn(len(items))]

	// Check duplicate
	_, existErr := s.gamificationRepo.FindUserInventoryItem(ctx, userID, item.ID)
	isDuplicate := existErr == nil

	catnipEarned := 0
	if isDuplicate {
		catnipEarned = duplicateCatnipReward
	}

	// Update gift box
	box.ItemID = &item.ID
	box.WasDuplicate = isDuplicate
	box.CatnipEarned = catnipEarned
	if err := s.gamificationRepo.UpdateGiftBox(ctx, box); err != nil {
		return nil, err
	}

	// Add item to inventory (if not duplicate) or add catnip
	user, err := s.gamificationRepo.FindUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	if isDuplicate {
		user.Catnip += catnipEarned
		if err := s.gamificationRepo.UpdateUser(ctx, user); err != nil {
			return nil, err
		}
	} else {
		inv := &model.UserInventory{
			UserID:       userID,
			ItemID:       item.ID,
			AcquiredFrom: "gift_box",
		}
		if err := s.gamificationRepo.CreateInventoryItem(ctx, inv); err != nil {
			return nil, err
		}
	}

	resp := &dto.OpenGiftBoxResponse{
		Item: dto.GiftBoxItemResponse{
			ID:          item.ID,
			Name:        item.Name,
			Slot:        item.Slot,
			Rarity:      item.Rarity,
			ImageURL:    item.ImageURL,
			Description: item.Description,
		},
		WasDuplicate:    isDuplicate,
		CatnipEarned:    catnipEarned,
		UserCatnipTotal: user.Catnip,
	}
	if isDuplicate {
		msg := fmt.Sprintf("이미 보유한 아이템입니다. Catnip %d개로 전환되었습니다.", catnipEarned)
		resp.Message = &msg
	}

	return resp, nil
}

// --- Shop ---

func (s *GamificationService) GetShop(ctx context.Context, userID uuid.UUID) (*dto.ShopResponse, error) {
	shopItems, err := s.gamificationRepo.FindShopItems(ctx)
	if err != nil {
		return nil, err
	}

	ownedItems, _ := s.gamificationRepo.FindUserInventory(ctx, userID)
	ownedMap := make(map[uuid.UUID]bool)
	for _, inv := range ownedItems {
		ownedMap[inv.ItemID] = true
	}

	var items []dto.ShopItemResponse
	for _, item := range shopItems {
		price := 0
		if item.ShopPriceCatnip != nil {
			price = *item.ShopPriceCatnip
		}
		items = append(items, dto.ShopItemResponse{
			ID:              item.ID,
			Name:            item.Name,
			Slot:            item.Slot,
			Rarity:          item.Rarity,
			ImageURL:        item.ImageURL,
			ShopPriceCatnip: price,
			UserOwns:        ownedMap[item.ID],
		})
	}

	var featured *dto.ShopItemResponse
	if len(items) > 0 {
		featured = &items[0]
	}

	return &dto.ShopResponse{FeaturedItem: featured, Items: items}, nil
}

func (s *GamificationService) PurchaseItem(ctx context.Context, userID uuid.UUID, req dto.PurchaseRequest) (*dto.PurchaseResponse, error) {
	item, err := s.gamificationRepo.FindItemByID(ctx, req.ItemID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrItemNotFound
		}
		return nil, err
	}
	if item.ShopPriceCatnip == nil {
		return nil, ErrItemNotInShop
	}

	// Check already owned
	_, existErr := s.gamificationRepo.FindUserInventoryItem(ctx, userID, item.ID)
	if existErr == nil {
		return nil, ErrItemAlreadyOwned
	}

	user, err := s.gamificationRepo.FindUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	price := *item.ShopPriceCatnip
	if user.Catnip < price {
		return nil, ErrInsufficientCatnip
	}

	user.Catnip -= price
	if err := s.gamificationRepo.UpdateUser(ctx, user); err != nil {
		return nil, err
	}

	inv := &model.UserInventory{
		UserID:       userID,
		ItemID:       item.ID,
		AcquiredFrom: "shop",
	}
	if err := s.gamificationRepo.CreateInventoryItem(ctx, inv); err != nil {
		return nil, err
	}

	return &dto.PurchaseResponse{
		Item: dto.ShopItemBasic{
			ID: item.ID, Name: item.Name, Slot: item.Slot, Rarity: item.Rarity,
		},
		CatnipSpent:        price,
		UserCatnipRemaining: user.Catnip,
	}, nil
}

// --- Achievements ---

func (s *GamificationService) GetAchievements(ctx context.Context, userID uuid.UUID) (*dto.AchievementsResponse, error) {
	allAch, err := s.gamificationRepo.FindAllAchievements(ctx)
	if err != nil {
		return nil, err
	}
	userAch, _ := s.gamificationRepo.FindUserAchievements(ctx, userID)

	unlockedMap := make(map[uuid.UUID]*model.UserAchievement)
	for i := range userAch {
		unlockedMap[userAch[i].AchievementID] = &userAch[i]
	}

	var resp []dto.AchievementDetailResponse
	for _, a := range allAch {
		detail := dto.AchievementDetailResponse{
			ID:          a.ID,
			Slug:        a.Slug,
			Name:        a.Name,
			Description: a.Description,
			IconURL:     a.IconURL,
			RewardType:  a.RewardType,
			RewardValue: json.RawMessage(a.RewardValue),
		}
		if ua, ok := unlockedMap[a.ID]; ok {
			detail.IsUnlocked = true
			detail.UnlockedAt = &ua.UnlockedAt
		}
		resp = append(resp, detail)
	}

	return &dto.AchievementsResponse{Achievements: resp}, nil
}

// --- Cat Equip ---

func (s *GamificationService) EquipCatItem(ctx context.Context, userID uuid.UUID, req dto.EquipCatItemRequest) (*dto.EquippedItemsResponse, error) {
	if req.ItemID != nil {
		// Verify user owns the item
		_, err := s.gamificationRepo.FindUserInventoryItem(ctx, userID, *req.ItemID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, ErrItemNotOwned
			}
			return nil, err
		}

		// Verify item is the correct slot
		item, err := s.gamificationRepo.FindItemByID(ctx, *req.ItemID)
		if err != nil {
			return nil, err
		}
		if item.Slot != req.Slot {
			return nil, fmt.Errorf("item slot mismatch: expected %s, got %s", req.Slot, item.Slot)
		}
	}

	// Unequip current item in that slot
	// Use raw SQL to join cat_items table
	if err := s.unequipSlotRaw(ctx, userID, req.Slot); err != nil {
		return nil, err
	}

	// Equip the new item
	if req.ItemID != nil {
		inv, err := s.gamificationRepo.FindUserInventoryItem(ctx, userID, *req.ItemID)
		if err != nil {
			return nil, err
		}
		inv.IsEquipped = true
		if err := s.gamificationRepo.UpdateInventoryItem(ctx, inv); err != nil {
			return nil, err
		}
	}

	return s.getEquippedItems(ctx, userID)
}

func (s *GamificationService) unequipSlotRaw(ctx context.Context, userID uuid.UUID, slot string) error {
	equipped, err := s.gamificationRepo.FindEquippedItems(ctx, userID)
	if err != nil {
		return err
	}
	for _, inv := range equipped {
		if inv.Item.Slot == slot {
			inv.IsEquipped = false
			if err := s.gamificationRepo.UpdateInventoryItem(ctx, &inv); err != nil {
				return err
			}
		}
	}
	return nil
}

func (s *GamificationService) getEquippedItems(ctx context.Context, userID uuid.UUID) (*dto.EquippedItemsResponse, error) {
	equipped, err := s.gamificationRepo.FindEquippedItems(ctx, userID)
	if err != nil {
		return nil, err
	}

	resp := &dto.EquippedItemsResponse{}
	for _, inv := range equipped {
		item := &dto.EquippedItemResponse{
			ID:       inv.Item.ID,
			Name:     inv.Item.Name,
			ImageURL: inv.Item.ImageURL,
		}
		switch inv.Item.Slot {
		case "hat":
			resp.Hat = item
		case "outfit":
			resp.Outfit = item
		case "accessory":
			resp.Accessory = item
		case "background":
			resp.Background = item
		case "expression":
			resp.Expression = item
		}
	}

	return resp, nil
}

// rollRarity picks a rarity based on box type drop rates.
func rollRarity(boxType string) string {
	rates, ok := dropRates[boxType]
	if !ok {
		rates = dropRates["basic"]
	}

	roll := rand.Float64()
	cumulative := 0.0
	for i, rate := range rates {
		cumulative += rate
		if roll < cumulative {
			return rarityOrder[i]
		}
	}
	return rarityOrder[0] // fallback
}
