#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Zero-pads unit folder numbers so they sort correctly.
 * e.g.  unit_1_place_value  →  unit_01_place_value
 *       unit_10_ratios      →  unit_10_ratios  (already 2 digits, unchanged)
 *
 * Run:  deno run --allow-read --allow-write scripts/zero_pad_units.ts
 * Dry:  deno run --allow-read --allow-write scripts/zero_pad_units.ts --dry-run
 */

import { walk } from "jsr:@std/fs@1";
import { join, relative } from "jsr:@std/path@1";

const DRY = Deno.args.includes("--dry-run");
const BASE = "curriculums/en/math/by_topics";

let renamed = 0;
let skipped = 0;

// Walk every directory under BASE, looking for unit folders at depth 3
// (domain/subdomain/unit_N_slug)
for await (
  const entry of walk(BASE, {
    maxDepth: 3,
    includeFiles: false,
    includeDirs: true,
  })
) {
  const name = entry.name;
  const match = name.match(/^unit_(\d+)_(.+)$/);
  if (!match) continue;

  const num = parseInt(match[1], 10);
  const slug = match[2];

  // Already two (or more) digits → nothing to do
  if (match[1].length >= 2) {
    skipped++;
    continue;
  }

  const paddedName = `unit_${String(num).padStart(2, "0")}_${slug}`;
  const oldPath = entry.path;
  const newPath = join(entry.path.replace(/[^/\\]+$/, ""), paddedName);

  if (DRY) {
    console.log(`[DRY] ${relative(BASE, oldPath)}  →  ${paddedName}`);
  } else {
    await Deno.rename(oldPath, newPath);
    console.log(`Renamed: ${name}  →  ${paddedName}`);
  }
  renamed++;
}

console.log(
  `\n✅ ${
    DRY ? "Would rename" : "Renamed"
  } ${renamed} folders. ${skipped} already padded.`,
);
