
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

export interface CardProp {
  practitioner: FilteredPractioner
}
 
 interface FilteredPractioner {
     title: string;
     practitionerId: string;
     firstname: string;
     lastname: string;
     gender: string;
     location: string;
     availability: string;
     appointment_type: string;
     year_of_experience: string;
     specialisations: {
      specialisationId: string;
      name?:string
     }[];
     profession: string;
     profilePictureUrl: string;
   bio: string;
   fee: number;
 }
   export interface FilteredPractitioners {
     data: FilteredPractioner[];
     total: number;
     page: number;
     pages: number;
  }
 export interface HandleFilterParams {
    [key: string]: any;
  }
export interface SpecialisationsProps  {
  specialisationId: string;
  name: string;
}

export interface FiltersProps {
  'appointment_type': string;
  'availability': string[]
  'fee'?: [number, number];
  'specialisations': SpecialisationsProps[];
}

export interface FilterBoxProps {
  onFilter: (filter: FiltersProps) => void;
}
