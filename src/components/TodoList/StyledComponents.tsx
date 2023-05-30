import styled from "styled-components";

export const SubtaskWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
  margin-bottom: 0.5rem;
`;

export const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
`;

export const Checkbox = styled.input`
  margin-right: 1rem;
`;

export const SubtaskTitle = styled.p`
  margin: 0;
`;

export const Container = styled.div`
  flex: 1;
  display: contents;
  align-items: center;
`;

export const BoxWrapper = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #f9f9f9;
`;

export const TodoTitle = styled.h3`
  color: #333;
  margin: 0;
`;

export const SubtaskList = styled.ul`
  list-style-type: none;
  padding: 0 2rem;
`;

export const SubtaskInputWrapper = styled.div`
  display: flex;
  margin: 0.75rem 0;
  justify-content: center;
`;

export const Input = styled.input`
  flex: 0.8;
  margin-right: 1rem;
`;

export const AddButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.6125rem;
  cursor: pointer;
  width: 8rem;
`;

export const ToggleIcon = styled.span`
  margin-left: 16px;
  cursor: pointer;
  font-size: 1rem;
  color: #777;
`;

export const TodoListContainer = styled.div`
  padding: 0 2rem;
`;

export const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

export const TodoInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

export const CompletionStatus = styled.p`
  margin: 0;
  color: #777;
`;
