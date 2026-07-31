import { InterviewRound, InterviewResult } from "../../../generated/prisma";

export interface CreateInterviewInput {
  jobApplicationId: string;
  round: InterviewRound;
  scheduledAt?: string;
  duration?: number;
  location?: string;
  interviewerNames?: string[];
  feedback?: string;
  result?: InterviewResult;
}

export interface UpdateInterviewInput {
  round?: InterviewRound;
  scheduledAt?: string;
  duration?: number;
  location?: string;
  interviewerNames?: string[];
  feedback?: string;
  result?: InterviewResult;
}

export interface InterviewQueryInput {
  search?: string;
  round?: InterviewRound;
  result?: InterviewResult;
  page?: number;
  limit?: number;
}
