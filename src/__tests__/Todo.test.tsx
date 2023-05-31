import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { act } from "react-dom/test-utils";

import { API_BASE_URL } from "../apiConfig";
import TodoList from "../components/TodoList/index";

jest.mock("axios");

describe("TodoList component test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const initialMockData = [
    {
      id: 1,
      title: "Task 1",
      status: "pending",
      createdAt: new Date(),
      Subtasks: [],
    },
    {
      id: 2,
      title: "Task 2",
      status: "completed",
      createdAt: new Date(),
      Subtasks: [],
    },
  ];

  test("renders TodoList component", async () => {
    await act(async () => {
      render(<TodoList />);
    });

    expect(screen.getByText("Todo App")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("fetches and renders initial todo list", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: initialMockData });
    await act(async () => {
      render(<TodoList />);
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/todos`);

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  test("adds a new todo", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: initialMockData });
    (axios.post as jest.Mock).mockResolvedValueOnce({});

    const newTodoMockData = [
      ...initialMockData,
      {
        id: 3,
        title: "New Task",
        status: "pending",
        createdAt: new Date(),
        Subtasks: [],
      },
    ];

    await act(async () => {
      render(<TodoList />);
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/todos`);

    await screen.findByText("Task 1");

    const input = screen.getByPlaceholderText("What to do?");
    const addButton = screen.getByText("New List");

    fireEvent.change(input, { target: { value: "New Task" } });
    fireEvent.click(addButton);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/todos`, {
      title: "New Task",
    });

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: newTodoMockData });

    await waitFor(() => {
      expect(screen.getByText("New Task")).toBeInTheDocument();
    });
  });

  test("updates the status of a todo", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: initialMockData });

    await act(async () => {
      render(<TodoList />);
    });

    await screen.findByText("Task 1");

    const checkbox = screen.getAllByRole("checkbox")[0];

    fireEvent.click(checkbox);

    expect(axios.patch).toHaveBeenCalledWith(`${API_BASE_URL}/todos/1`, {
      status: "completed",
    });

    const updatedMockData = [
      {
        id: 1,
        title: "Task 1",
        status: "completed",
        createdAt: new Date(),
        Subtasks: [],
      },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: updatedMockData });

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(checkbox).toBeChecked();
    });
  });

  test("shows and hides subtasks when clicking the accordion icon", async () => {
    const subtaskMockData = [
      {
        id: 1,
        title: "Subtask 1",
        status: "pending",
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "Subtask 2",
        status: "pending",
        createdAt: new Date(),
      },
    ];

    const mockData = [
      {
        id: 1,
        title: "Task 1",
        status: "pending",
        createdAt: new Date(),
        Subtasks: subtaskMockData,
      },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    await act(async () => {
      render(<TodoList />);
    });

    await screen.findByText("Task 1");

    const openAccordionIcon = screen.getByText("▶");

    fireEvent.click(openAccordionIcon);

    expect(screen.queryByText("Subtask 1")).toBeInTheDocument();
    expect(screen.queryByText("Subtask 2")).toBeInTheDocument();

    const closeAccordionIcon = screen.getByText("▼");
    fireEvent.click(closeAccordionIcon);

    expect(screen.queryByText("Subtask 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Subtask 2")).not.toBeInTheDocument();
  });

  test("updates the status of a subtask", async () => {
    const mockData = [
      {
        id: 1,
        title: "Task 1",
        status: "pending",
        createdAt: new Date(),
        Subtasks: [
          {
            id: 1,
            title: "Subtask 1",
            status: "pending",
            createdAt: new Date(),
          },
        ],
      },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    await act(async () => {
      render(<TodoList />);
    });

    await screen.findByText("Task 1");

    const openAccordionIcon = screen.getByText("▶");

    fireEvent.click(openAccordionIcon);

    const subtaskCheckbox = screen.getAllByRole("checkbox")[1];

    fireEvent.click(subtaskCheckbox);

    expect(axios.patch).toHaveBeenCalledTimes(1);
    expect(axios.patch).toHaveBeenCalledWith(
      `${API_BASE_URL}/subtasks/1`,
      expect.objectContaining({
        status: "completed",
      })
    );

    const updatedMockData = [
      {
        id: 1,
        title: "Task 1",
        status: "pending",
        createdAt: new Date(),
        Subtasks: [
          {
            id: 1,
            title: "Subtask 1",
            status: "completed",
            createdAt: new Date(),
          },
        ],
      },
    ];
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: updatedMockData });

    await waitFor(() => {
      expect(subtaskCheckbox).toBeChecked();
    });
  });

  test("adds a new subtask", async () => {
    const mockData = [
      {
        id: 1,
        title: "Task 1",
        status: "pending",
        createdAt: new Date(),
        Subtasks: [],
      },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    await act(async () => {
      render(<TodoList />);
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/todos`);

    await screen.findByText("Task 1");

    const openAccordionIcon = screen.getByText("▶");
    fireEvent.click(openAccordionIcon);

    const addSubtaskInput = screen.getByPlaceholderText("What are the steps?");
    fireEvent.change(addSubtaskInput, { target: { value: "Subtask 1" } });

    const addButton = screen.getByText("New Step");
    await fireEvent.click(addButton);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `${API_BASE_URL}/todos/1/subtasks`,
      {
        title: "Subtask 1",
      }
    );

    const updatedMockData = [
      {
        ...mockData,
        Subtasks: [
          {
            id: 1,
            title: "Subtask 1",
            status: "pending",
            createdAt: new Date(),
          },
        ],
      },
    ];

    await (axios.get as jest.Mock).mockResolvedValueOnce({
      data: updatedMockData,
    });

    expect(await screen.getByDisplayValue("Subtask 1")).toBeInTheDocument();
  });
});
