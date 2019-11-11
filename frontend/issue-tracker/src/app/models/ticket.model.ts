import { SubTask } from './subtask.model';
import { User } from './user.model';

export enum Priority {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very high'
}

export const priorityArr = Object.values(Priority);

export enum TicketStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  ACTIVE = 'active'
}

export const ticketStatusArr = Object.values(TicketStatus);

export class Ticket {
  id: string;
  owner: User;
  editors: string[];
  lastEditor: User;
  assignedTo: User;
  priority: Priority;
  neededAt: Date;
  title: string;
  description: string;
  status: TicketStatus;
  affectedSystems: string[];
  subTasks: SubTask[];
  createdAt: Date;
  updatedAt: Date;
}


