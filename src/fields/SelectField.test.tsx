import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectField } from "./SelectField";

const options = [
  { value: "EUR", label: "Euro" },
  { value: "USD", label: "US Dollar" },
];

describe("SelectField", () => {
  it("renders a label", () => {
    render(<SelectField id="currency" label="Convert from currency" />);
    expect(screen.getByText("Convert from currency")).toBeInTheDocument();
  });

  it("does not render an error message when no error prop is given", () => {
    render(<SelectField id="currency" label="Currency" options={options} />);
    expect(
      document.querySelector(".form__control-error"),
    ).not.toBeInTheDocument();
  });

  it("renders the error message when an error prop is given", () => {
    render(
      <SelectField
        id="currency"
        label="Currency"
        options={options}
        error="Currencies must be different"
      />,
    );
    expect(
      screen.getByText("Currencies must be different"),
    ).toBeInTheDocument();
  });

  it("renders the select control", () => {
    render(<SelectField id="currency" label="Currency" options={options} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("displays the selected option", () => {
    render(
      <SelectField
        id="currency"
        label="Currency"
        options={options}
        selectedOption={options[0]}
      />,
    );
    expect(screen.getByText("Euro")).toBeInTheDocument();
  });

  it("calls handleChange when an option is selected", async () => {
    const handleChange = vi.fn();
    render(
      <SelectField
        id="currency"
        label="Currency"
        options={options}
        handleChange={handleChange}
      />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getAllByRole("option")[0]);
    expect(handleChange).toHaveBeenCalledWith(
      options[0],
      expect.objectContaining({ action: "select-option" }),
    );
  });
});
