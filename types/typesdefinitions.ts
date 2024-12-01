interface Client {
  clientId: string,
  firstname:string,
  lastname: string,
  othername:string,
  email: string
  dateofbirth: Date
  gender: string,
  isActive: number,
  phonenumber: string,
  address: string,
  profilePictureUrl: string,
  profession:string,
  bio:string
}
interface Practitioner {
  practitionerId: string,
  firstname:string,
  lastname: string,
  othername:string,
  email: string
  dateofbirth: Date
  gender: string,
  isActive: number,
  phonenumber: string,
  address: string,
  profilePictureUrl: string,
  profession:string,
  bio:string
}


export interface ClientsProps {
  client: Client
}
export interface PractitionerProps {
  practitioner: Practitioner
}

export interface SignUpType {
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  appUpdatesConsent: number,
  accountOption:string
}
export interface SignUpMessageProps {
  linkClass: string,
  headlineClass: string,
  paragraphClass: string,
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