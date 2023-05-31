export interface Todo {
  id: number;
  title: string;
  status: string;
  createdAt: Date;
  Subtasks: Subtask[];
}

export interface Subtask {
  id: number;
  title: string;
  status: string;
  createdAt: Date;
}
