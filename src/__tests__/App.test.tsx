import React from "react";
import { render } from "@testing-library/react";
import App from "../App";

test("renders TodoList component", () => {
  const { getByText } = render(<App />);
  const todoListElement = getByText("Todo App");
  expect(todoListElement).toBeInTheDocument();
});
