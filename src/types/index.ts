export type Priority = 'low' | 'medium' | 'high';

export type Category = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type Todo = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null; // ISO date (YYYY-MM-DD) o null
  priority: Priority;
  completed: boolean;
  category_id: string | null;
  inserted_at: string;
  updated_at: string;
  category?: Category | null;
};
