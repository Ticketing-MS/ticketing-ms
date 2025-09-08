import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { tickets } from "./1756798749_tickets";
import { relations } from "drizzle-orm";

export const subTickets = pgTable("sub_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentTicketId: uuid("parent_ticket_id")
    .notNull()
    .references(() => tickets.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  childTicketId: uuid("child_ticket_id")
    .notNull()
    .references(() => tickets.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subTicketsRelations = relations(subTickets, ({ one }) => ({
  parentTicket: one(tickets, {
    fields: [subTickets.parentTicketId],
    references: [tickets.id],
  }),
  childTicket: one(tickets, {
    fields: [subTickets.childTicketId],
    references: [tickets.id],
  }),
}));
