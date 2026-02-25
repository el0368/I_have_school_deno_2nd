import { expandGlob } from "jsr:@std/fs@1/expand-glob";
import { ensureDir } from "jsr:@std/fs@1/ensure-dir";
import { basename, dirname, join } from "jsr:@std/path@1";

const BASE_DIR = "c:\\GitHub\\I_have_school_deno_2nd\\curriculums\\math";
const TOPICS_DIR = join(BASE_DIR, "by_topics");

async function migrate() {
  for await (const file of expandGlob(join(BASE_DIR, "**/*.mdx"))) {
    // Skip if already in by_topics
    if (
      file.path.includes("by_topics") ||
      file.path.includes("by_grade_structured")
    ) continue;

    // file.path format: c:\GitHub\I_have_school_deno_2nd\curriculums\math\grade_1\unit_1_place_value\1...
    const relative = file.path.substring(BASE_DIR.length + 1);
    const parts = relative.split("\\");

    let grade = "unknown_grade";
    let unit = "general_unit";

    if (parts[0].startsWith("grade_") || parts[0] === "kindergarten") {
      grade = parts[0];
      if (parts.length > 2) {
        unit = parts[1];
      }
    } else if (parts[0] === "by_grade" && parts.length === 2) {
      grade = parts[1].replace(".mdx", "");
      unit = "general";
    }

    let targetTopicFolder = "1_the_core\\01_number_sense_and_operations";
    const unitLower = unit.toLowerCase();

    if (unitLower.includes("fraction")) {
      targetTopicFolder = "1_the_core\\02_fractions_and_proportions";
    } else if (unitLower.includes("pattern")) {
      targetTopicFolder = "1_the_core\\03_patterns_and_rules";
    } else if (
      unitLower.includes("measure") || unitLower.includes("time") ||
      unitLower.includes("money")
    ) targetTopicFolder = "2_space_and_measurement\\04_measurement_and_scale";
    else if (unitLower.includes("geomet") || unitLower.includes("shape")) {
      targetTopicFolder = "2_space_and_measurement\\05_geometric_reasoning";
    } else if (unitLower.includes("trig")) {
      targetTopicFolder = "2_space_and_measurement\\06_trigonometry_and_waves";
    } else if (unitLower.includes("equat") || unitLower.includes("variable")) {
      targetTopicFolder =
        "3_change_and_relationships\\07_variables_and_equations";
    } else if (unitLower.includes("function") || unitLower.includes("graph")) {
      targetTopicFolder = "3_change_and_relationships\\08_functions_and_graphs";
    } else if (unitLower.includes("system") || unitLower.includes("matri")) {
      targetTopicFolder = "3_change_and_relationships\\09_systems_and_matrices";
    } else if (unitLower.includes("prob")) {
      targetTopicFolder =
        "4_data_and_uncertainty\\10_probability_and_combinatorics";
    } else if (unitLower.includes("stat") || unitLower.includes("data")) {
      targetTopicFolder =
        "4_data_and_uncertainty\\11_statistics_and_data_science";
    } else if (unitLower.includes("limit") || unitLower.includes("continu")) {
      targetTopicFolder = "5_continuous_mathematics\\12_limits_and_continuity";
    } else if (unitLower.includes("deriv") || unitLower.includes("diff")) {
      targetTopicFolder = "5_continuous_mathematics\\13_differential_calculus";
    } else if (unitLower.includes("integr")) {
      targetTopicFolder = "5_continuous_mathematics\\14_integral_calculus";
    } else if (unitLower.includes("multiv") || unitLower.includes("vector")) {
      targetTopicFolder =
        "5_continuous_mathematics\\15_multivariable_and_vector_calculus";
    }

    let content = await Deno.readTextFile(file.path);

    // Attempt to extract title from markdown # Header
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch
      ? titleMatch[1].replace(/"/g, '\\"')
      : basename(file.path, ".mdx").replace(/_/g, " ");

    if (!content.startsWith("---")) {
      const frontmatter = `---
title: "${title}"
grade: "${grade}"
unit: "${unit}"
---

`;
      content = frontmatter + content;
    }

    // Nest the grade and unit inside the target topic folder to keep it clean
    let destPathStr = "";
    if (unit !== "general") {
      destPathStr = join(
        TOPICS_DIR,
        targetTopicFolder,
        grade,
        unit,
        basename(file.path),
      );
    } else {
      destPathStr = join(
        TOPICS_DIR,
        targetTopicFolder,
        grade,
        basename(file.path),
      );
    }

    await ensureDir(dirname(destPathStr));
    await Deno.writeTextFile(destPathStr, content);

    // Cleanup old file
    await Deno.remove(file.path);
    console.log(`Migrated: ${basename(file.path)} -> ${targetTopicFolder}`);
  }
}

migrate().then(() => console.log("Done migrating files!")).catch(console.error);
