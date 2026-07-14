import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { vi } from "vitest";
import App from "./App";

vi.mock("ipdata", () => ({
  default: vi.fn().mockImplementation(function () {
    return {
      lookup: vi
        .fn()
        .mockResolvedValue({ currency: { code: "USD", name: "US Dollar" } }),
    };
  }),
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const mockRatesResponse = {
  rates: { USD: 1.1, GBP: 0.85 },
  timestamp: 1234567890,
};

describe("App", () => {
  it("has no detectable accessibility violations once loaded", async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(mockRatesResponse),
    });

    const { container } = render(<App />);

    await screen.findAllByRole("combobox");

    expect(await axe(container)).toHaveNoViolations();
  });
});
