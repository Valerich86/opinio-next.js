import { CookieValueTypes } from "cookies-next";

export type User = {
  id: string;
  email: string;
  password: string;
};

export type Survey = {
  id: string,
  user_id: string,
  title: string,
  is_published: boolean,
  created_at: string
}

export type Question = {
  id: string,
  survey_id: string,
  text: string,
  type: string,
  answer_options: string[],
  sort_order: number
}

export type UserResponse = {
  id: string,
  survey_id: string,
  user_id: string,
  created_at: string
}

export type Answer = {
  id: string,
  response_id: string,
  question_id: string,
  single_value: string,
  multiple_value: string[],
  rating_value: number,
}

export type SurveyStats = {
  id: string,
  survey_id: string,
  session_id: string,
  event: 'started' | 'completed',
  timestamp: string,
  total_time: number
}

export type RegistrationFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegistrationFormErrors = {
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type LoginError = {
  error?: string
}

export type SurveyError = {
  title?: string
}

export type UserCookies = {
  name?: string,
  userId?: string 
}