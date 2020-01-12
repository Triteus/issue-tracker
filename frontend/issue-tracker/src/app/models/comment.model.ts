import { User } from './user.model';

export interface UserComment {
  id: string;
  user: User;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
