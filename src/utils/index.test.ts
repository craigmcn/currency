import { vi } from "vitest";
import { fetchCurrencies, fetchUserData } from "./index";

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

const mockJsonResponse = (data: unknown) => ({
  json: () => Promise.resolve(data),
});

const mockRatesResponse = {
  rates: { USD: 1.1, GBP: 0.85 },
  timestamp: 1234567890,
};

// Only USD and GBP are in the currencyCountries map with their matching cca3 codes
const mockCountriesResponse = [
  {
    cca3: "USA",
    currencies: { USD: { name: "US Dollar", symbol: "$" } },
    flag: "🇺🇸",
  },
  {
    cca3: "GBR",
    currencies: { GBP: { name: "Pound Sterling", symbol: "£" } },
    flag: "🇬🇧",
  },
];

describe("fetchCurrencies", () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("dispatches SET_TIMESTAMP, SET_CURRENCIES, SET_CURRENCY_LIST, SET_LOADING on success", async () => {
    mockFetch
      .mockResolvedValueOnce(mockJsonResponse(mockRatesResponse))
      .mockResolvedValueOnce(mockJsonResponse(mockCountriesResponse));

    await fetchCurrencies(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_TIMESTAMP",
      payload: mockRatesResponse.timestamp,
    });
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "SET_CURRENCIES" }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "SET_CURRENCY_LIST" }),
    );
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_LOADING",
      payload: false,
    });
  });

  it("includes EUR as the base currency in SET_CURRENCIES", async () => {
    mockFetch
      .mockResolvedValueOnce(mockJsonResponse(mockRatesResponse))
      .mockResolvedValueOnce(mockJsonResponse(mockCountriesResponse));

    await fetchCurrencies(dispatch);

    const setCurrenciesCall = dispatch.mock.calls.find(
      ([action]) => action.type === "SET_CURRENCIES",
    );
    const currencies = setCurrenciesCall?.[0].payload;
    expect(currencies.some((c: { code: string }) => c.code === "EUR")).toBe(
      true,
    );
  });

  it("currencies are sorted alphabetically by name", async () => {
    mockFetch
      .mockResolvedValueOnce(mockJsonResponse(mockRatesResponse))
      .mockResolvedValueOnce(mockJsonResponse(mockCountriesResponse));

    await fetchCurrencies(dispatch);

    const setCurrenciesCall = dispatch.mock.calls.find(
      ([action]) => action.type === "SET_CURRENCIES",
    );
    const currencies: { name: string }[] = setCurrenciesCall?.[0].payload;
    const names = currencies.map((c) => c.name);
    expect(names).toEqual([...names].sort());
  });

  it("dispatches SET_ERRORS and SET_LOADING when the rates API returns an error", async () => {
    mockFetch.mockResolvedValueOnce(
      mockJsonResponse({ error: { message: "API error" } }),
    );

    await expect(fetchCurrencies(dispatch)).rejects.toThrow("API error");

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "SET_ERRORS" }),
    );
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_LOADING",
      payload: false,
    });
  });

  it("dispatches SET_ERRORS and SET_LOADING when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network failure"));

    await expect(fetchCurrencies(dispatch)).rejects.toThrow("Network failure");

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "SET_ERRORS" }),
    );
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_LOADING",
      payload: false,
    });
  });
});

describe("fetchUserData", () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("dispatches SET_USER with the lookup result", async () => {
    await fetchUserData(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "SET_USER" }),
    );
  });

  it("dispatches SET_USER even when response has a message", async () => {
    const IPData = (await import("ipdata")).default as ReturnType<typeof vi.fn>;
    IPData.mockImplementationOnce(function () {
      return {
        lookup: vi
          .fn()
          .mockResolvedValue({ message: "rate limited", currency: null }),
      };
    });

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await fetchUserData(dispatch);

    expect(warnSpy).toHaveBeenCalledWith("rate limited");
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "SET_USER" }),
    );
    warnSpy.mockRestore();
  });
});
