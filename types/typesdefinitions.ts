
export interface User {
  id: string;
  firstname:string;
  lastname: string;
  othername:string;
  email: string
  dateofbirth: Date | null;
  gender: string;
  isActive: number;
  phonenumber: string;
  address: string;
  profilePictureUrl: string;
  profession:string;
  bio:string
}

export interface  AuthState  {
  token: string;
  id: string;
  role: string;
}

export type AuthContextType = {
  authState: AuthState | null;
  setAuthState: (state: AuthState | null) => void;
};
export interface SignUpType {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  appUpdatesConsent: number;
  accountOption:string
}
export interface SignUpMessageProps {
  linkClass: string;
  headlineClass: string;
  paragraphClass: string;
}

export type FormData = | {
  errors?: {
    firstname?: string[]
    lastname?: string[]
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
  }
  message?: string
}
  | undefined

 export  interface DropDownMenuProps {
  onLogout: () => void;
  user: null |{
    id: string,
    role: string,
    token: string
  }
}