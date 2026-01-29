export interface SubGoal {
  id: number;
  content: string;
  is_completed: boolean;
}

export interface Goal {
  id: number;
  title: string;
  sub_goals: SubGoal[];
}

export interface Mandalart {
  user_id: string;
  title: string;
  goals: Goal[];
  created_at?: string;
  updated_at?: string;
}