export interface Ticket {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  phaseId: string;
  createdBy: string;
  referenceCode: string;
  startDate: Date | null;
  dueDate: Date | null;
  order: number;
  isTask: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}
