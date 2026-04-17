package dto

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// --- Inventory ---

type InventoryResponse struct {
	Items      []InventoryItemResponse `json:"items"`
	TotalItems int                     `json:"total_items"`
}

type InventoryItemResponse struct {
	ID           uuid.UUID `json:"id"`
	Name         string    `json:"name"`
	Slot         string    `json:"slot"`
	Rarity       string    `json:"rarity"`
	ImageURL     string    `json:"image_url"`
	IsEquipped   bool      `json:"is_equipped"`
	AcquiredFrom string    `json:"acquired_from"`
	AcquiredAt   time.Time `json:"acquired_at"`
}

// --- Gift Boxes ---

type PendingGiftBoxesResponse struct {
	PendingBoxes []PendingGiftBox `json:"pending_boxes"`
	Count        int              `json:"count"`
}

type PendingGiftBox struct {
	ID        uuid.UUID `json:"id"`
	BoxType   string    `json:"box_type"`
	EarnedAt  time.Time `json:"earned_at"`
}

type OpenGiftBoxResponse struct {
	Item           GiftBoxItemResponse `json:"item"`
	WasDuplicate   bool                `json:"was_duplicate"`
	CatnipEarned   int                 `json:"catnip_earned"`
	UserCatnipTotal int                `json:"user_catnip_total"`
	Message        *string             `json:"message,omitempty"`
}

type GiftBoxItemResponse struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Slot        string    `json:"slot"`
	Rarity      string    `json:"rarity"`
	ImageURL    string    `json:"image_url"`
	Description *string   `json:"description,omitempty"`
}

// --- Shop ---

type ShopResponse struct {
	FeaturedItem *ShopItemResponse  `json:"featured_item"`
	Items        []ShopItemResponse `json:"items"`
}

type ShopItemResponse struct {
	ID               uuid.UUID `json:"id"`
	Name             string    `json:"name"`
	Slot             string    `json:"slot"`
	Rarity           string    `json:"rarity"`
	ImageURL         string    `json:"image_url"`
	ShopPriceCatnip  int       `json:"shop_price_catnip"`
	UserOwns         bool      `json:"user_owns"`
}

type PurchaseRequest struct {
	ItemID uuid.UUID `json:"item_id" binding:"required"`
}

type PurchaseResponse struct {
	Item              ShopItemBasic `json:"item"`
	CatnipSpent       int           `json:"catnip_spent"`
	UserCatnipRemaining int         `json:"user_catnip_remaining"`
}

type ShopItemBasic struct {
	ID     uuid.UUID `json:"id"`
	Name   string    `json:"name"`
	Slot   string    `json:"slot"`
	Rarity string    `json:"rarity"`
}

// --- Achievements ---

type AchievementsResponse struct {
	Achievements []AchievementDetailResponse `json:"achievements"`
}

type AchievementDetailResponse struct {
	ID          uuid.UUID       `json:"id"`
	Slug        string          `json:"slug"`
	Name        string          `json:"name"`
	Description string          `json:"description"`
	IconURL     *string         `json:"icon_url"`
	IsUnlocked  bool            `json:"is_unlocked"`
	UnlockedAt  *time.Time      `json:"unlocked_at"`
	RewardType  string          `json:"reward_type"`
	RewardValue json.RawMessage `json:"reward_value"`
}

// --- Cat Equip ---

type EquipCatItemRequest struct {
	Slot   string     `json:"slot"    binding:"required,oneof=hat outfit accessory background expression"`
	ItemID *uuid.UUID `json:"item_id"`
}

type EquippedItemResponse struct {
	ID       uuid.UUID `json:"id"`
	Name     string    `json:"name"`
	ImageURL string    `json:"image_url"`
}

type EquippedItemsResponse struct {
	Hat        *EquippedItemResponse `json:"hat"`
	Outfit     *EquippedItemResponse `json:"outfit"`
	Accessory  *EquippedItemResponse `json:"accessory"`
	Background *EquippedItemResponse `json:"background"`
	Expression *EquippedItemResponse `json:"expression"`
}
