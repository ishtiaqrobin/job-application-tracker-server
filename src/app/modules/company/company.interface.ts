export interface CreateCompanyInput {
  name: string;
  website?: string;
  location?: string;
  industry?: string;
  logoUrl?: string;
}

export interface UpdateCompanyInput {
  name?: string;
  website?: string;
  location?: string;
  industry?: string;
  logoUrl?: string;
}

export interface CompanyQueryInput {
  search?: string;
  industry?: string;
  location?: string;
}
