import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../apiConfig";
import { Todo } from "./types";
import SubtaskItem from "./SubtaskItem";
import {
  AddButton,
  BoxWrapper,
  Container,
  CompletionStatus,
  CheckboxWrapper,
  Checkbox,
  TodoTitle,
  ToggleIcon,
  SubtaskList,
  SubtaskInputWrapper,
  Input,
} from "./StyledComponents";

interface TodoItemProps {
  todo: Todo;
  updateTodoList: () => Promise<void>;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, updateTodoList }) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const updateTodoStatus = async (status: string) => {
    try {
      await axios.patch(`${API_BASE_URL}/todos/${todo.id}`, { status });
      updateTodoList();
    } catch (error) {
      console.log("Error updating todo status:", error);
    }
  };

  const createSubtask = async () => {
    if (newSubtaskTitle.trim() === "") {
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/todos/${todo.id}/subtasks`,
        { title: newSubtaskTitle }
      );
      const createdSubtask = response.data;
      const updatedTodo = { ...todo };
      updatedTodo.Subtasks.push(createdSubtask);
      updateTodoList();
      setNewSubtaskTitle("");
    } catch (error) {
      console.log("Error creating subtask:", error);
    }
  };

  const countCompletedSubtasks = (): number => {
    return todo.Subtasks.filter((subtask) => subtask.status === "completed")
      .length;
  };

  return (
    <Container>
      <BoxWrapper>
        <CheckboxWrapper>
          <Checkbox
            type="checkbox"
            checked={todo.status === "completed"}
            onChange={() =>
              updateTodoStatus(
                todo.status === "completed" ? "pending" : "completed"
              )
            }
          />
          <TodoTitle className="text-overflow-ellipsis">{todo.title}</TodoTitle>
        </CheckboxWrapper>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <CompletionStatus>
            {countCompletedSubtasks()} of {todo.Subtasks.length} completed
          </CompletionStatus>
          <ToggleIcon onClick={handleToggle}>
            {isExpanded ? "▼" : "▶"}
          </ToggleIcon>
        </div>
      </BoxWrapper>
      {isExpanded && (
        <>
          <SubtaskList>
            {todo.Subtasks.map((subtask) => (
              <SubtaskItem
                key={`Subtask-Item-${subtask.id}`}
                subtask={subtask}
                updateTodoList={updateTodoList}
              />
            ))}
          </SubtaskList>
          <SubtaskInputWrapper>
            <Input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="What are the steps?"
            />
            <AddButton onClick={createSubtask}>New Step</AddButton>
          </SubtaskInputWrapper>
        </>
      )}
    </Container>
  );
};

export default TodoItem;
