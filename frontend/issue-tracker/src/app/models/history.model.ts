import { User } from './user.model';

export interface History {
  editor: User;
  editedAt: Date;
  changedPaths: {path: string, oldValue: string, newValue: string}[];
}
