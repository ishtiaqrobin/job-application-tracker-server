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
