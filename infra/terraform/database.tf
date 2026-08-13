# Instance keys: one shared instance by default, or one per environment when
# var.split_sql_instances flips. Keeping this in a for_each means the switch is
# a variable change rather than a rewrite.
locals {
  sql_instances = var.split_sql_instances ? local.envs : ["shared"]
  sql_owner     = { for e in local.envs : e => var.split_sql_instances ? e : "shared" }
}

resource "google_sql_database_instance" "pg" {
  for_each         = toset(local.sql_instances)
  name             = "forin-pg-${each.value}"
  database_version = "POSTGRES_16"
  region           = var.region

  settings {
    tier              = var.sql_tier
    availability_type = "ZONAL"
    disk_size         = 10
    disk_autoresize   = true

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
      start_time                     = "18:00" # 03:00 KST
    }

    ip_configuration {
      # The instance has an IP but no authorized networks, so direct TCP from
      # anywhere is refused. Cloud Run reaches it through the Cloud SQL
      # connector, which authenticates with IAM and an ephemeral certificate
      # over a unix socket.
      #
      # Turning ipv4_enabled off instead would require a VPC network, private
      # services access and Direct VPC egress — the connector has no path to a
      # private-IP-only instance without them. That is a later hardening step,
      # not a default.
      #
      # authorized_networks is a repeatable block, not a list attribute in the
      # google provider's 6.x schema — declaring zero of them (by omission) is
      # how "nothing may connect directly" is expressed here.
      ipv4_enabled = true
    }
  }

  # Leave this on until launch is behind us; flipping it to false is a
  # deliberate act, not a default.
  deletion_protection = true

  depends_on = [google_project_service.required]
}

resource "google_sql_database" "db" {
  for_each = toset(local.envs)
  name     = "forin_${each.value}"
  instance = google_sql_database_instance.pg[local.sql_owner[each.value]].name
}

resource "random_password" "db" {
  for_each = toset(local.envs)
  length   = 32
  special  = false # keep it URL-safe: the password goes into DATABASE_URL
}

resource "google_sql_user" "app" {
  for_each = toset(local.envs)
  name     = "forin_${each.value}"
  instance = google_sql_database_instance.pg[local.sql_owner[each.value]].name
  password = random_password.db[each.value].result
}

locals {
  # A unix socket, so the database needs no public IP. This becomes the
  # database-url-${e} secret (secrets.tf) and is never written into a Cloud
  # Run env value directly — runtime.tf and the ops jobs read it back via
  # secret_key_ref.
  db_url = { for e in local.envs :
    e => "postgres://forin_${e}:${random_password.db[e].result}@/forin_${e}?host=/cloudsql/${google_sql_database_instance.pg[local.sql_owner[e]].connection_name}"
  }
}

# Redis is not a cache here: RefreshStore keeps refresh-token hashes with a
# 30-day TTL, so losing it logs everyone out. Serverless Redis in Tokyo — the
# workload (cache, rate limit, daily reset, token store) is not latency-critical
# at the millisecond level, and Memorystore would add fixed cost plus a VPC
# connector.
resource "upstash_redis_database" "cache" {
  for_each       = toset(local.envs)
  database_name  = "forin-${each.value}"
  region         = "global"
  primary_region = "ap-northeast-1"
  tls            = true
}
