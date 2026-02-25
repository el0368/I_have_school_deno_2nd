#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Renumbers duplicate unit folders in a given topic directory.
 * For example, if there are multiple unit_1_* folders, it will renumber them
 * sequentially (unit_1_..., unit_2_..., unit_3_...) based on the grade level
 * of the files inside them.
 */

import { walk } from "jsr:@std/fs@1";
import { join } from "jsr:@std/path@1";

const DRY = Deno.args.includes("--dry-run");

async function renumberUnits(topicDir: string) {
  console.log(`\nProcessing ${topicDir}...`);

  // 1. Find all unit folders
  const unitFolders: string[] = [];
  for await (const entry of Deno.readDir(topicDir)) {
    if (entry.isDirectory && entry.name.startsWith("unit_")) {
      unitFolders.push(entry.name);
    }
  }

  if (unitFolders.length === 0) {
    console.log("No unit folders found.");
    return;
  }

  // 2. Determine the "grade level" of each folder to sort them logically
  // We'll look at the first .mdx file in each folder to guess the grade
  const folderGrades = new Map<string, number>();

  for (const folder of unitFolders) {
    const fullPath = join(topicDir, folder);
    let gradeScore = 999; // Default high score if no files found

    for await (const entry of Deno.readDir(fullPath)) {
      if (entry.isFile && entry.name.endsWith(".mdx")) {
        const match = entry.name.match(
          /^(kindergarten|grade_(\d+)|algebra_1|geometry|algebra_2|precalculus)_/,
        );
        if (match) {
          if (match[1] === "kindergarten") gradeScore = 0;
          else if (match[2]) gradeScore = parseInt(match[2], 10);
          else if (match[1] === "algebra_1") gradeScore = 9;
          else if (match[1] === "geometry") gradeScore = 10;
          else if (match[1] === "algebra_2") gradeScore = 11;
          else if (match[1] === "precalculus") gradeScore = 12;
        }
        break; // Just need one file to guess the grade
      }
    }
    folderGrades.set(folder, gradeScore);
  }

  // 3. Sort folders by grade score, then alphabetically
  unitFolders.sort((a, b) => {
    const scoreA = folderGrades.get(a) ?? 999;
    const scoreB = folderGrades.get(b) ?? 999;
    if (scoreA !== scoreB) return scoreA - scoreB;
    return a.localeCompare(b);
  });

  // 4. Renumber them sequentially
  let currentUnitNum = 1;
  for (const oldFolder of unitFolders) {
    const match = oldFolder.match(/^unit_\d+_(.+)$/);
    if (!match) continue; // Skip if it doesn't match the expected pattern

    const slug = match[1];
    const newFolder = `unit_${currentUnitNum}_${slug}`;

    if (oldFolder !== newFolder) {
      const oldPath = join(topicDir, oldFolder);
      const newPath = join(topicDir, newFolder);

      if (DRY) {
        console.log(`[DRY] Rename: ${oldFolder} -> ${newFolder}`);
      } else {
        await Deno.rename(oldPath, newPath);
        console.log(`Renamed: ${oldFolder} -> ${newFolder}`);

        // Also update the 'unit:' frontmatter in the files inside
        for await (const entry of walk(newPath, { exts: [".mdx"] })) {
          const content = await Deno.readTextFile(entry.path);
          const updatedContent = content.replace(
            /^unit:\s*.+$/m,
            `unit: ${slug}`,
          );
          if (content !== updatedContent) {
            await Deno.writeTextFile(entry.path, updatedContent);
          }
        }
      }
    } else {
      console.log(`Kept: ${oldFolder}`);
    }
    currentUnitNum++;
  }
}

async function main() {
  const topicsToProcess = [
    "curriculums/en/math/by_topics/1_the_core/01_number_sense_and_operations",
    "curriculums/en/math/by_topics/1_the_core/02_fractions_and_proportions",
    "curriculums/en/math/by_topics/1_the_core/03_patterns_and_rules",
    "curriculums/en/math/by_topics/2_space_and_measurement/04_measurement_and_scale",
    "curriculums/en/math/by_topics/2_space_and_measurement/05_geometric_reasoning",
    "curriculums/en/math/by_topics/3_change_and_relationships/07_variables_and_equations",
    "curriculums/en/math/by_topics/4_data_and_uncertainty/10_probability_and_combinatorics",
    "curriculums/en/math/by_topics/4_data_and_uncertainty/11_statistics_and_data_science",
  ];

  for (const topic of topicsToProcess) {
    try {
      const stat = await Deno.stat(topic);
      if (stat.isDirectory) {
        await renumberUnits(topic);
      }
    } catch (e) {
      if (!(e instanceof Deno.errors.NotFound)) {
        console.error(`Error processing ${topic}:`, e);
      }
    }
  }
}

await main();
