import {
  ApplicationSource,
  ApplicationStatus,
  ExperienceLevel,
  JobNature,
  Priority,
  WorkMode,
} from "../../../generated/prisma";

export interface CreateApplicationInput {
  companyId?: string;
  companyNameSnapshot: string;
  position: string;
  jobLink?: string;
  jobLocation?: string;
  jobNature?: JobNature;
  workMode?: WorkMode;
  experienceLevel?: ExperienceLevel;
  status?: ApplicationStatus;
  priority?: Priority;
  source?: ApplicationSource;
  appliedDate?: string;
  deadline?: string;
  followUpDate?: string;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  currency?: string;
  offerAmount?: number;
  techStack?: string[];
  rejectionReason?: string;
  hasTakeHome?: boolean;
  takeHomeNotes?: string;
  followUpCount?: number;
  resumeDriveLink?: string;
  coverLetterLink?: string;
  comments?: string;
  notes?: string;
  isReferral?: boolean;
  referredBy?: string;
  tagIds?: string[];
}

export interface UpdateApplicationInput {
  companyId?: string;
  companyNameSnapshot?: string;
  position?: string;
  jobLink?: string;
  jobLocation?: string;
  jobNature?: JobNature;
  workMode?: WorkMode;
  experienceLevel?: ExperienceLevel;
  status?: ApplicationStatus;
  priority?: Priority;
  source?: ApplicationSource;
  appliedDate?: string;
  deadline?: string;
  followUpDate?: string;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  currency?: string;
  offerAmount?: number;
  techStack?: string[];
  rejectionReason?: string;
  hasTakeHome?: boolean;
  takeHomeNotes?: string;
  followUpCount?: number;
  resumeDriveLink?: string;
  coverLetterLink?: string;
  comments?: string;
  notes?: string;
  isReferral?: boolean;
  referredBy?: string;
  tagIds?: string[];
}

export interface ApplicationQueryInput {
  status?: ApplicationStatus;
  priority?: Priority;
  source?: ApplicationSource;
  workMode?: WorkMode;
  jobNature?: JobNature;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
