import { render, screen } from "./testUtils/render";
import { expect, it } from "vitest";
import App from "./App";

it("mounts every section of the Overview page with real card data, through the actual app composition", async () => {
  render(<App />);
  expect(screen.getByText("Cards overview")).toBeInTheDocument();
  expect(await screen.findAllByText("Private Card")).not.toHaveLength(0);
  expect(screen.getByText("Current balance · Private Card")).toBeInTheDocument();
  expect(screen.getByLabelText("Minimum amount")).toBeInTheDocument();
  expect(screen.getByText("Recent activity · Private Card")).toBeInTheDocument();
});
