export interface UserTypes {
  fullName: string;
  password: string;
  phoneNumber: string;
  _id: string;
}

export interface TrainerTypes {
  photo: null | any;
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
