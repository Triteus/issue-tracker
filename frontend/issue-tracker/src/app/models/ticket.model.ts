import { SubTask } from './subtask.model';

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
  ownerId: string;
  editorIds: string[];
  lastEditorId: string;
  assignedTo: string;
  priority: Priority;
  neededAt: Date;
  title: string;
  description: string;
  status: TicketStatus;
  subTasks: SubTask[];
  createdAt: Date;
  editedAt: Date;
}


