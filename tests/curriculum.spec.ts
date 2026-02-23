import { expect, test } from "@playwright/test";

const CURRICULUM_URLS = [
  "/learn/math/grade_1/unit_1_place_value/0_introduction",
  "/learn/math/grade_1/unit_1_place_value/1_numbers_from_1_to_9",
  "/learn/math/grade_1/unit_1_place_value/2_numbers_from_1_to_100",
  "/learn/math/grade_1/unit_1_place_value/3_understanding_place_value",
  "/learn/math/grade_1/unit_1_place_value/4_tens_and_ones",
];

test.describe("Curriculum Smoke Tests", () => {
  for (const url of CURRICULUM_URLS) {
    test(`Should load ${url} without 500 error`, async ({ page }) => {
      // Assuming dev server runs on 5173
      const response = await page.goto(`http://127.0.0.1:5173${url}`);

      // Ensure the page loaded successfully
      expect(response?.status()).toBe(200);

      // Verify the page doesn't show a Fresh error overlay or 500 text
      const pageText = await page.textContent("body");
      expect(pageText).not.toContain("Internal Server Error");
      expect(pageText).not.toContain("Error during render");

      // Look for the breadcrumb or article tag as a sign of successful MDX rendering
      const articleExists = await page.locator("article").isVisible();
      expect(articleExists).toBeTruthy();
    });
  }
});
