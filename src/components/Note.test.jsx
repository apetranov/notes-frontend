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

  render(<Note note={note} toggleImportance={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText("make not important");
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(1);
});

test("renders make important button", async () => {
  const note = {
    content: "Test note",
    important: false,
  };

  render(<Note note={note} />);

  const makeImportantButton = screen.getByText("make important");
  // expect(toggleImportanceButton.textContent).toBe("make important");
  expect(makeImportantButton).toBeInTheDocument();
});

test("li element exists in Note component", async () => {
  const note = {
    content: "note",
    important: true,
  };

  render(<Note note={note} />);

  // screen.debug();

  const liElement = screen.getByRole('listitem');

  expect(liElement).toBeInTheDocument();
});

test("renders make not important button", async () => {
  const note = {
    content: "Important note",
    important: true
  };

  render(<Note note={note} />);

  const makeNotImportantButton = screen.getByText('make not important');
  expect(makeNotImportantButton).toBeInTheDocument();
})

test("mock change importance", async() => {
  const note = {
    content: "Just a note :)",
    important: false
  };

  const makeImportant = vi.fn((note) => !note.important);

  expect(makeImportant(note)).toBe(true);
});