import { expect, test } from "@playwright/test";

test("production market representative app renders without runtime errors", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(page.locator("#root")).not.toBeEmpty();
  expect(pageErrors).toEqual([]);
});
