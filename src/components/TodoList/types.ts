export interface Todo {
  id: number;
  title: string;
  status: string;
  createdAt: string;
  Subtasks: Subtask[];
}

export interface Subtask {
  id: number;
  title: string;
  status: string;
  createdAt: string;
}
