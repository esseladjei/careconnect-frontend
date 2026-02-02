export interface User {
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  gender?: string;
  role?: string;
  dateOfBirth: Date;
  languages?: string[];
  address?: string;
  createdAt?: Date;
}

export interface UserPassword {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
