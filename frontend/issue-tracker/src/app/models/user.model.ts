export enum UserRole {
  Admin = 'admin',
  Support = 'support'
}


export class User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roles: Array<UserRole>;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

