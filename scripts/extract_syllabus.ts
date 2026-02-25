import { ensureDir } from "jsr:@std/fs@1/ensure-dir";
import { dirname, join } from "jsr:@std/path@1";

const BASE_DIR =
  "c:\\GitHub\\I_have_school_deno_2nd\\curriculums\\math\\by_topics\\1_the_core\\01_number_sense_and_operations";
const TOPICS_DIR =
  "c:\\GitHub\\I_have_school_deno_2nd\\curriculums\\math\\by_topics";

const files = [
  "kindergarten.mdx",
  "grade_3.mdx",
  "grade_4.mdx",
  "grade_5.mdx",
  "grade_6.mdx",
  "grade_7.mdx",
  "grade_8.mdx",
];

async function extract() {
  for (const filename of files) {
    const filePath = join(BASE_DIR, filename);
    const grade = filename.replace(".mdx", "");

    let content;
    try {
      content = await Deno.readTextFile(filePath);
    } catch {
      continue; // Skip if not found
    }

    const chunks = content.split(/^##\s+/m);

    for (let i = 1; i < chunks.length; i++) {
      const chunk = chunks[i];
      const lines = chunk.trim().split("\n");
      const titleLine = lines[0].trim(); // e.g., "Unit 1: Intro to Multiplication"

      // e.g. "unit_1_intro_to_multiplication"
      const unitName = titleLine.replace(/[^a-zA-Z0-9 ]/g, "").replace(
        /\s+/g,
        "_",
      ).toLowerCase();

      const unitLower = titleLine.toLowerCase();
      let targetTopicFolder = "1_the_core\\01_number_sense_and_operations";
      let topicTag = "01_number_sense_and_operations";

      if (
        unitLower.includes("fraction") || unitLower.includes("proportion") ||
        unitLower.includes("ratio") || unitLower.includes("percent")
      ) {
        targetTopicFolder = "1_the_core\\02_fractions_and_proportions";
        topicTag = "02_fractions_and_proportions";
      } else if (
        unitLower.includes("pattern") || unitLower.includes("sequence")
      ) {
        targetTopicFolder = "1_the_core\\03_patterns_and_rules";
        topicTag = "03_patterns_and_rules";
      } else if (
        unitLower.includes("measure") || unitLower.includes("time") ||
        unitLower.includes("money") || unitLower.includes("length") ||
        unitLower.includes("area") || unitLower.includes("perimeter") ||
        unitLower.includes("volume")
      ) {
        targetTopicFolder = "2_space_and_measurement\\04_measurement_and_scale";
        topicTag = "04_measurement_and_scale";
      } else if (
        unitLower.includes("geomet") || unitLower.includes("shape") ||
        unitLower.includes("quadrilateral") || unitLower.includes("figure") ||
        unitLower.includes("angle") || unitLower.includes("plane") ||
        unitLower.includes("polygon")
      ) {
        targetTopicFolder = "2_space_and_measurement\\05_geometric_reasoning";
        topicTag = "05_geometric_reasoning";
      } else if (unitLower.includes("trig")) {
        targetTopicFolder =
          "2_space_and_measurement\\06_trigonometry_and_waves";
        topicTag = "06_trigonometry_and_waves";
      } else if (
        unitLower.includes("equat") || unitLower.includes("variable") ||
        unitLower.includes("expression") || unitLower.includes("inequalit") ||
        unitLower.includes("algebra")
      ) {
        targetTopicFolder =
          "3_change_and_relationships\\07_variables_and_equations";
        topicTag = "07_variables_and_equations";
      } else if (
        unitLower.includes("function") || unitLower.includes("graph") ||
        unitLower.includes("coordinate")
      ) {
        targetTopicFolder =
          "3_change_and_relationships\\08_functions_and_graphs";
        topicTag = "08_functions_and_graphs";
      } else if (
        unitLower.includes("system") || unitLower.includes("matri") ||
        unitLower.includes("transform")
      ) {
        targetTopicFolder =
          "3_change_and_relationships\\09_systems_and_matrices";
        topicTag = "09_systems_and_matrices";
      } else if (unitLower.includes("prob") || unitLower.includes("combin")) {
        targetTopicFolder =
          "4_data_and_uncertainty\\10_probability_and_combinatorics";
        topicTag = "10_probability_and_combinatorics";
      } else if (
        unitLower.includes("stat") || unitLower.includes("data") ||
        unitLower.includes("distribution")
      ) {
        targetTopicFolder =
          "4_data_and_uncertainty\\11_statistics_and_data_science";
        topicTag = "11_statistics_and_data_science";
      } else if (
        unitLower.includes("number") || unitLower.includes("arithmetic") ||
        unitLower.includes("add") || unitLower.includes("subtract") ||
        unitLower.includes("multiply") ||
        unitLower.includes("multiplication") || unitLower.includes("divide") ||
        unitLower.includes("division") || unitLower.includes("decimal") ||
        unitLower.includes("factor") || unitLower.includes("multiple")
      ) {
        targetTopicFolder = "1_the_core\\01_number_sense_and_operations";
        topicTag = "01_number_sense_and_operations";
      }

      const frontmatter = `---
title: "${titleLine.replace(/"/g, '\\"')}"
grade: "${grade}"
topic: "${topicTag}"
---

# ${titleLine}

${lines.slice(1).join("\n").trim()}
`;

      const destPathStr = join(
        TOPICS_DIR,
        targetTopicFolder,
        `${grade}_${unitName}.mdx`,
      );

      await ensureDir(dirname(destPathStr));
      await Deno.writeTextFile(destPathStr, frontmatter);
      console.log(
        `Extracted: ${grade}_${unitName}.mdx -> ${targetTopicFolder}`,
      );
    }

    // Delete the original file after extracting
    await Deno.remove(filePath);
    console.log(`Deleted original syllabus file: ${filename}`);
  }
}

extract().then(() => console.log("Done extracting syllabus units!")).catch(
  console.error,
);
