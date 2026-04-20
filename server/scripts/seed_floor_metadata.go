package main

import (
	"log"

	"gorm.io/gorm"
)

// seedFloorMetadata assigns Spatial UX metadata (floor, map coords) to
// modules and units that already exist. It is re-runnable; edits to
// coordinates in SQL between runs are preserved because we only write
// columns where the current value equals the migration default.
func seedFloorMetadata(db *gorm.DB) {
	// Modules → floors. The nurse curriculum currently has two modules
	// (order_index 1 and 2). We map them to floors 1 and 2 using the
	// emergency-room / ward metaphor from the Spatial UX design spec.
	moduleUpdates := []struct {
		orderIndex int
		label      string
		icon       string
		assetKey   string
	}{
		{1, "Emergency Room", "triage", "floor-1-er"},
		{2, "General Ward", "ward", "floor-2-ward"},
	}
	for _, m := range moduleUpdates {
		err := db.Exec(`
			UPDATE curriculum_modules
			   SET floor_order   = ?,
			       floor_label   = ?,
			       floor_icon    = ?,
			       map_asset_key = ?
			 WHERE order_index = ?
			   AND floor_label = '';
		`, m.orderIndex, m.label, m.icon, m.assetKey, m.orderIndex).Error
		if err != nil {
			log.Fatalf("seed module floor (%d): %v", m.orderIndex, err)
		}
	}

	// Units → map coordinates. Each module has 4 units (order_index 1..4).
	// We place them in a 2×2 grid on their floor canvas. The same
	// coordinates apply to both modules — the canvas will differentiate
	// via the floor's map_asset_key when real art ships.
	unitCoords := []struct {
		orderIndex int
		location   string
		x, y       float64
	}{
		{1, "triage", 30.0, 35.0},
		{2, "bedside", 70.0, 35.0},
		{3, "consult", 30.0, 70.0},
		{4, "ward", 70.0, 70.0},
	}
	for _, u := range unitCoords {
		err := db.Exec(`
			UPDATE units
			   SET location_type = ?,
			       map_x         = ?,
			       map_y         = ?
			 WHERE order_index   = ?
			   AND location_type = 'generic';
		`, u.location, u.x, u.y, u.orderIndex).Error
		if err != nil {
			log.Fatalf("seed unit coords (%d): %v", u.orderIndex, err)
		}
	}
}
