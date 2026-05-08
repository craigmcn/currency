import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("renders a label and input", () => {
    render(<TextField id="amount" label="Amount" />);
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
  });

  it("does not render an error message when no error prop is given", () => {
    render(<TextField id="amount" label="Amount" />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(
      document.querySelector(".form__control-error"),
    ).not.toBeInTheDocument();
  });

  it("renders the error message when an error prop is given", () => {
    render(<TextField id="amount" label="Amount" error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("applies the error class to the input when an error is given", () => {
    render(<TextField id="amount" label="Amount" error="Required" />);
    expect(screen.getByLabelText("Amount")).toHaveClass(
      "form__control--hasError",
    );
  });

  it("does not apply the error class when no error", () => {
    render(<TextField id="amount" label="Amount" />);
    expect(screen.getByLabelText("Amount")).not.toHaveClass(
      "form__control--hasError",
    );
  });

  it("calls handleChange when the input value changes", async () => {
    const handleChange = vi.fn();
    render(
      <TextField id="amount" label="Amount" handleChange={handleChange} />,
    );
    await userEvent.type(screen.getByLabelText("Amount"), "42");
    expect(handleChange).toHaveBeenCalled();
  });

  it("calls handleKeyDown when a key is pressed", async () => {
    const handleKeyDown = vi.fn();
    render(
      <TextField id="amount" label="Amount" handleKeyDown={handleKeyDown} />,
    );
    await userEvent.type(screen.getByLabelText("Amount"), "{Enter}");
    expect(handleKeyDown).toHaveBeenCalled();
  });
});
