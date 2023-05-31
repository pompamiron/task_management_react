import axios from "axios";
import React, { useEffect, useState } from "react";

import { API_BASE_URL } from "../../apiConfig";
import {
  AddButton,
  Input,
  Title,
  TodoInputWrapper,
  TodoListContainer,
} from "./StyledComponents";
import TodoItem from "./TodoItem";
import { Todo } from "./types";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  useEffect(() => {
    updateTodoList();
  }, []);

  const updateTodoList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  const handleNewTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.target.value);
  };

  const handleAddTodo = async () => {
    if (newTodoTitle.trim() === "") {
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/todos`, { title: newTodoTitle });
      setNewTodoTitle("");
      updateTodoList();
    } catch (error) {
      console.log("Error adding new todo:", error);
    }
  };

  return (
    <TodoListContainer>
      <Title>Todo App</Title>
      <TodoInputWrapper>
        <Input
          type="text"
          value={newTodoTitle}
          onChange={handleNewTodoChange}
          placeholder="What to do?"
        />
        <AddButton onClick={handleAddTodo}>New List</AddButton>
      </TodoInputWrapper>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} updateTodoList={updateTodoList} />
      ))}
    </TodoListContainer>
  );
};

export default TodoList;
