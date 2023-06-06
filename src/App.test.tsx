import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders h3 title", () => {
  render(<App />);
  const titleElement = screen.getByText(/Grindery integration mockup/i);
  expect(titleElement).toBeInTheDocument();
});
