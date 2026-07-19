#!/usr/bin/env node
/**
 * Bulk-import Tennessee spiritual seva rows into Supabase.
 *
 * Default is dry-run (prints payload, inserts nothing).
 * After reviewing scripts/data/tennessee-spiritual-seva.json, run with --confirm.
 *
 * Usage:
 *   node scripts/import-tennessee-spiritual-seva.mjs
 *   node scripts/import-tennessee-spiritual-seva.mjs --confirm
 *   node scripts/import-tennessee-spiritual-seva.mjs --confirm --skip-ambiguous
 */

import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_PATH = resolve(__dirname, "data/tennessee-spiritual-seva.json")
const TABLE = "spiritual_seva_submission"
const INSERT_KEYS = [
  "first_name",
  "middle_name",
  "last_name",
  "ghaam",
  "country",
  "mandal",
  "phone_country_code",
  "mobile_number",
  "jaap",
  "malas",
  "pradakshinas",
  "dandvats",
  "dhyan",
]

function loadEnvLocal() {
  const envPath = resolve(__dirname, "../.env.local")
  const text = readFileSync(envPath, "utf8")
  for (const line of text.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

function parseArgs(argv) {
  return {
    confirm: argv.includes("--confirm"),
    skipAmbiguous: argv.includes("--skip-ambiguous"),
  }
}

function toInsertRow(row) {
  const out = {}
  for (const key of INSERT_KEYS) {
    out[key] = row[key] ?? null
  }
  return out
}

function sumField(rows, field) {
  return rows.reduce((sum, row) => sum + (Number(row[field]) || 0), 0)
}

async function main() {
  const { confirm, skipAmbiguous } = parseArgs(process.argv.slice(2))
  loadEnvLocal()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL / anon key in .env.local")
    process.exit(1)
  }

  const payload = JSON.parse(readFileSync(DATA_PATH, "utf8"))
  let rows = payload.rows ?? []

  if (skipAmbiguous) {
    const before = rows.length
    rows = rows.filter((row) => !row._ambiguous)
    console.log(`Skipping ambiguous rows: ${before - rows.length} skipped, ${rows.length} remaining`)
  }

  const insertRows = rows.map(toInsertRow)
  const ambiguous = rows.filter((row) => row._ambiguous)

  console.log("--- Tennessee spiritual seva import ---")
  console.log(`Source: ${payload.meta?.source_file ?? DATA_PATH}`)
  console.log(`Rows ready: ${insertRows.length}`)
  console.log(`Ambiguous in selection: ${ambiguous.length}`)
  console.log("Totals in selection:")
  for (const field of ["jaap", "malas", "pradakshinas", "dandvats", "dhyan"]) {
    console.log(`  ${field}: ${sumField(insertRows, field)}`)
  }

  if (!confirm) {
    console.log("\nDRY RUN — no rows inserted.")
    console.log("Review scripts/data/tennessee-spiritual-seva.json first.")
    console.log("Then re-run with: node scripts/import-tennessee-spiritual-seva.mjs --confirm")
    console.log("Optional: add --skip-ambiguous to omit flagged rows.")
    console.log("\nSample first 3 insert payloads:")
    console.log(JSON.stringify(insertRows.slice(0, 3), null, 2))
    return
  }

  if (ambiguous.length > 0 && !skipAmbiguous) {
    console.warn(
      `\nWarning: importing ${ambiguous.length} ambiguous rows. Use --skip-ambiguous to omit them.`
    )
  }

  const supabase = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  const { data, error } = await supabase.from(TABLE).insert(insertRows).select("id, first_name, last_name")

  if (error) {
    console.error("Insert failed:", error.message)
    console.error(error)
    process.exit(1)
  }

  console.log(`\nInserted ${data?.length ?? 0} rows into ${TABLE}.`)
  console.log(JSON.stringify(data, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
