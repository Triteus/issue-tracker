export enum UserRole {
  Admin = 'admin',
  Support = 'support',
  Visitor = 'visitor'
}


export class User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Array<UserRole>;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

