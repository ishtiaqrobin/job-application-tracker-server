export interface CreateReminderInput {
  jobApplicationId?: string;
  title: string;
  remindAt: string;
}

export interface UpdateReminderInput {
  title?: string;
  remindAt?: string;
  isCompleted?: boolean;
}

export interface ReminderQueryInput {
  search?: string;
  isCompleted?: string;
  page?: number;
  limit?: number;
}
