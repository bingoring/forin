package repository

import (
	"context"

	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GamificationRepository struct {
	db *gorm.DB
}

func NewGamificationRepository(db *gorm.DB) *GamificationRepository {
	return &GamificationRepository{db: db}
}

// --- Inventory ---

func (r *GamificationRepository) FindUserInventory(ctx context.Context, userID uuid.UUID) ([]model.UserInventory, error) {
	var items []model.UserInventory
	err := r.db.WithContext(ctx).
		Preload("Item").
		Where("user_id = ?", userID).
		Order("acquired_at DESC").
		Find(&items).Error
	return items, err
}

func (r *GamificationRepository) FindUserInventoryItem(ctx context.Context, userID, itemID uuid.UUID) (*model.UserInventory, error) {
	var inv model.UserInventory
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND item_id = ?", userID, itemID).
		First(&inv).Error
	if err != nil {
		return nil, err
	}
	return &inv, nil
}

func (r *GamificationRepository) CreateInventoryItem(ctx context.Context, inv *model.UserInventory) error {
	return r.db.WithContext(ctx).Create(inv).Error
}

func (r *GamificationRepository) UpdateInventoryItem(ctx context.Context, inv *model.UserInventory) error {
	return r.db.WithContext(ctx).Save(inv).Error
}

// UnequipSlot sets is_equipped=false for all items of a given slot for a user.
func (r *GamificationRepository) UnequipSlot(ctx context.Context, userID uuid.UUID, slot string) error {
	return r.db.WithContext(ctx).
		Model(&model.UserInventory{}).
		Where("user_id = ? AND is_equipped = true", userID).
		Joins("JOIN cat_items ON cat_items.id = user_inventory.item_id").
		Where("cat_items.slot = ?", slot).
		Update("is_equipped", false).Error
}

func (r *GamificationRepository) FindEquippedItems(ctx context.Context, userID uuid.UUID) ([]model.UserInventory, error) {
	var items []model.UserInventory
	err := r.db.WithContext(ctx).
		Preload("Item").
		Where("user_id = ? AND is_equipped = true", userID).
		Find(&items).Error
	return items, err
}

// --- Gift Boxes ---

func (r *GamificationRepository) FindPendingGiftBoxes(ctx context.Context, userID uuid.UUID) ([]model.GiftBoxOpening, error) {
	var boxes []model.GiftBoxOpening
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND item_id IS NULL", userID).
		Order("opened_at DESC").
		Find(&boxes).Error
	return boxes, err
}

func (r *GamificationRepository) FindGiftBoxByID(ctx context.Context, boxID uuid.UUID) (*model.GiftBoxOpening, error) {
	var box model.GiftBoxOpening
	err := r.db.WithContext(ctx).First(&box, "id = ?", boxID).Error
	if err != nil {
		return nil, err
	}
	return &box, nil
}

func (r *GamificationRepository) UpdateGiftBox(ctx context.Context, box *model.GiftBoxOpening) error {
	return r.db.WithContext(ctx).Save(box).Error
}

// --- Cat Items ---

func (r *GamificationRepository) FindActiveItems(ctx context.Context) ([]model.CatItem, error) {
	var items []model.CatItem
	err := r.db.WithContext(ctx).
		Where("is_active = true").
		Find(&items).Error
	return items, err
}

func (r *GamificationRepository) FindItemByID(ctx context.Context, itemID uuid.UUID) (*model.CatItem, error) {
	var item model.CatItem
	err := r.db.WithContext(ctx).First(&item, "id = ?", itemID).Error
	if err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *GamificationRepository) FindItemsByRarity(ctx context.Context, rarity string) ([]model.CatItem, error) {
	var items []model.CatItem
	err := r.db.WithContext(ctx).
		Where("is_active = true AND rarity = ?", rarity).
		Find(&items).Error
	return items, err
}

func (r *GamificationRepository) FindShopItems(ctx context.Context) ([]model.CatItem, error) {
	var items []model.CatItem
	err := r.db.WithContext(ctx).
		Where("is_active = true AND shop_price_catnip IS NOT NULL").
		Order("shop_price_catnip ASC").
		Find(&items).Error
	return items, err
}

// --- Achievements ---

func (r *GamificationRepository) FindAllAchievements(ctx context.Context) ([]model.Achievement, error) {
	var achievements []model.Achievement
	err := r.db.WithContext(ctx).Find(&achievements).Error
	return achievements, err
}

func (r *GamificationRepository) FindUserAchievements(ctx context.Context, userID uuid.UUID) ([]model.UserAchievement, error) {
	var ua []model.UserAchievement
	err := r.db.WithContext(ctx).
		Preload("Achievement").
		Where("user_id = ?", userID).
		Find(&ua).Error
	return ua, err
}

// --- User (for catnip updates) ---

func (r *GamificationRepository) FindUserByID(ctx context.Context, userID uuid.UUID) (*model.User, error) {
	var user model.User
	err := r.db.WithContext(ctx).
		Where("id = ? AND deleted_at IS NULL", userID).
		First(&user).Error
	return &user, err
}

func (r *GamificationRepository) UpdateUser(ctx context.Context, user *model.User) error {
	return r.db.WithContext(ctx).Save(user).Error
}
