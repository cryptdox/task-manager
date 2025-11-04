export type TaskPeriod = 'morning' | 'day' | 'night';

export interface TaskManagerUser {
  id: string;
  user_name: string;
  is_admin: boolean;
  password: string;
  created_at: string;
}

export interface TaskType {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
}

export interface TaskTag {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
}

export interface Task {
  id: string;
  task: string;
  task_tag: string | null;
  task_period: TaskPeriod;
  date: string;
  user_id: string;
  created_at: string;
}

export interface TaskTagTaskType {
  task_tag_id: string;
  task_type_id: string;
}

export type ToDoTaskType = 'always' | 'one_time' | 'progress';

export interface ToDoTask {
  id: string;
  to_do_type: ToDoTaskType;
  parent_task: string | null;
  description: string;
  created_on: string; // ISO date string
  task_tag: string | null;
  archived: boolean;
  user_id: string; // Supabase auth user ID
}

