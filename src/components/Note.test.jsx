import { fireEvent, render, screen } from "@testing-library/react";
import Note from "./Note";
import { expect } from "vitest";
import userEvent from "@testing-library/user-event";


test("renders content", () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  render(<Note note={note} />);

  screen.debug();

  const element = screen.getByText(
    "Component testing is done with react-testing-library",
    { exact: false },
  );

  screen.debug(element);

  expect(element).toBeDefined();
});

test("does not render this", () => {
  const note = {
    content: "This is a reminder",
    important: true,
  };

  render(<Note note={note} />);

  const element = screen.queryByText("do not want this to be rendered");
  expect(element).toBeNull();
});

test("renders content w CSS-selector querySelector", () => {
  const note = {
    content: "Does not work anymore :(",
    important: true,
  };

  const { container } = render(<Note note={note} />);

  const div = container.querySelector(".note");
  expect(div).toHaveTextContent("Does not work anymore :(");
});

test("clicking the button calls event handler once", async () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  const mockHandler = vi.fn();

  render(
    <Note note={note} toggleImportance={mockHandler} />
  );

  const user = userEvent.setup();
  const button = screen.getByText('make not important');
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(1);
});

test("renders important", async () => {
  const note = {
    content: "Test note",
    important: false
  };
  render(<Note note={note} />)

  const toggleImportanceButton = screen.getByRole('button');
  expect(toggleImportanceButton.textContent).toBe('make important');
});