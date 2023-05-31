import React from "react";
import axios from "axios";

import { API_BASE_URL } from "../../apiConfig";
import { Subtask } from "./types";
import {
  SubtaskWrapper,
  CheckboxWrapper,
  Checkbox,
  SubtaskTitle,
} from "./StyledComponents";

interface SubtaskItemProps {
  subtask: Subtask;
  updateTodoList: () => Promise<void>;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({
  subtask,
  updateTodoList,
}) => {
  const updateSubtaskStatus = async (status: string) => {
    try {
      await axios.patch(`${API_BASE_URL}/subtasks/${subtask.id}`, { status });
      updateTodoList();
    } catch (error) {
      console.log("Error updating subtask status:", error);
    }
  };

  const handleCheckboxChange = () => {
    const newStatus = subtask.status === "completed" ? "pending" : "completed";
    updateSubtaskStatus(newStatus);
  };

  return (
    <SubtaskWrapper>
      <CheckboxWrapper>
        <Checkbox
          type="checkbox"
          checked={subtask.status === "completed"}
          onChange={handleCheckboxChange}
        />
      </CheckboxWrapper>
      <SubtaskTitle className="text-overflow-ellipsis">
        {subtask.title}
      </SubtaskTitle>
    </SubtaskWrapper>
  );
};

export default SubtaskItem;
