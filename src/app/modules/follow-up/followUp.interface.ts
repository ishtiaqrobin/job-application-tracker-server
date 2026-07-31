export interface CreateFollowUpInput {
  jobApplicationId: string;
  contactedAt: string;
  note?: string;
  response?: string;
}

export interface UpdateFollowUpInput {
  contactedAt?: string;
  note?: string;
  response?: string;
}

export interface FollowUpQueryInput {
  search?: string;
  page?: number;
  limit?: number;
}
