import { Ticket } from './ticket.model';
import { User } from './user.model';

export enum ProjectType {
  DESIGN = 'design',
  PLANNING = 'planning',
  REQUIREMENTS = 'requirements',
  ARCHITECTURE = 'architecture',
  PROTOTYPING = 'prototyping',
  DEV = 'dev',
  TESTING = 'testing',
  PROD = 'prod',
  INFRA = 'infra',
  OTHER = 'other'
}
export const projectTypeArr = Object.values(ProjectType);

export enum ProjectStatus {
  OPEN = 'open',
  ACTIVE = 'active',
  FINISHED = 'closed',
  DEFERRED = 'deferred',
  ABORTED = 'aborted'
}
export const projectStatusArr = Object.values(ProjectStatus);

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  description: string;
  status: ProjectStatus;
  tickets: Ticket[];
  assignedUsers: User[];
  projectLeader: User;
  filenames: string[];
  createdAt: Date;
  updatedAt: Date;
}
