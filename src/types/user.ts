export interface User {
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  createdAt?: Date;
}

export interface UserPassword {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
