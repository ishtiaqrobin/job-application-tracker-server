export interface CreateContactInput {
  companyId?: string;
  jobApplicationId?: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
}

export interface UpdateContactInput {
  companyId?: string;
  jobApplicationId?: string;
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
}

export interface ContactQueryInput {
  search?: string;
  companyId?: string;
  jobApplicationId?: string;
}
