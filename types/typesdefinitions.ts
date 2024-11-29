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

export interface ClientsProps {
  client: Client
}

export interface SignUpType {
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  termsconsent: number,
  appupdatesconsent: number
}
export interface SignUpMessageProps {
  linkClass: string,
  headlineClass: string,
  paragraphClass: string,
}
