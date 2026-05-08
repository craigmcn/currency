import React, { useReducer } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConverterForm from "./ConverterForm";
import ConverterContext from "../hooks/context";
import converterReducer, { defaultState } from "../hooks/reducers";
import { IConversionState } from "../types";

const currencyList = [
  { value: "EUR", label: "Euro" },
  { value: "USD", label: "US Dollar" },
];

const readyState: IConversionState = {
  ...defaultState,
  loading: false,
  currencyList,
};

function Wrapper({
  initialState = readyState,
}: {
  initialState?: IConversionState;
}) {
  const [state, dispatch] = useReducer(converterReducer, initialState);
  return (
    <ConverterContext.Provider value={{ state, dispatch }}>
      <ConverterForm />
    </ConverterContext.Provider>
  );
}

describe("ConverterForm", () => {
  it("shows a duplicate-currency error when the same currency is chosen for both selects", async () => {
    render(<Wrapper />);

    const [fromCombobox, toCombobox] = screen.getAllByRole("combobox");

    await userEvent.click(fromCombobox);
    await userEvent.click(screen.getAllByRole("option")[0]); // Euro

    await userEvent.click(toCombobox);
    await userEvent.click(screen.getAllByRole("option")[0]); // Euro again

    expect(
      screen.getByText("Currencies must be different"),
    ).toBeInTheDocument();
  });
});
