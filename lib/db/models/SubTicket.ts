export interface SubTicket {
  id: string;
  parentTicketId: string;
  childTicketId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
