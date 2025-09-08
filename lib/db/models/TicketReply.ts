export interface TicketReply {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  duration: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}
