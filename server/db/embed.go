// Package db embeds the SQL migrations so the binary carries them instead of
// depending on files next to the runner. A Cloud Run Job has no checkout.
package db

import "embed"

//go:embed migrations/*.sql
var Migrations embed.FS
