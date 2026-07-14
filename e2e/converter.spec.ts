import { test, expect, type Page } from "@playwright/test";

const mockRates = {
  rates: { USD: 1.1, GBP: 0.85 },
  timestamp: 1234567890,
};

async function mockBackend(page: Page) {
  await page.route("**/api/exchange-rates/latest", (route) =>
    route.fulfill({ json: mockRates }),
  );
  await page.route("https://api.ipdata.co/**", (route) =>
    route.fulfill({ json: { currency: { code: "USD", name: "US Dollar" } } }),
  );
}

test("loads the currency converter and shows the currency fields", async ({
  page,
}) => {
  await mockBackend(page);
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Convert a currency" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Conversion" })).toBeVisible();

  await expect(page.getByRole("combobox").first()).toBeVisible({
    timeout: 15000,
  });
  await expect(page.getByLabel("Amount")).toBeVisible();
});

test("converts an amount between currencies", async ({ page }) => {
  await mockBackend(page);
  await page.goto("/");

  const toCombobox = page.getByRole("combobox").nth(1);
  await expect(toCombobox).toBeVisible({ timeout: 15000 });
  await toCombobox.click();
  await page.getByRole("option").first().click();

  const amountField = page.getByLabel("Amount");
  await amountField.fill("100");
  await amountField.blur();

  await expect(page.getByText("equals")).toBeVisible();
});
