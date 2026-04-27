export interface UserTypes {
  fullName: string;
  password: string;
  phoneNumber: string;
  _id: string;
}

export interface TrainerTypes {
  photo: string | File | null;
  fullName: string;
  experience: string;
  level: string;
  students: string;
  _id: string;
}

export interface BlogTypes {
  title: string;
  description: string;
  photos: string[];
  _id: string;
  createdAt: string;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
}
