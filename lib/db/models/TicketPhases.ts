export interface TicketPhase {
  id: string;
  name: string;
  order: number;
  projectId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
