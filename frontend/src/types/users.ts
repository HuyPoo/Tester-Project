export enum Roles {
  Manager = "Manager",
  Stylist = "Stylist",
  Customer = "Customer",
}

export interface UserState {
  userId: string
  role: Roles
}
