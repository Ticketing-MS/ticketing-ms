import {
  pgTable,
  text,
  timestamp,
  varchar,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./1756795931_users";
import { projects } from "./1756796090_projects";
import { ticketPhases } from "./1756796171_ticket_phases";
import { relations } from "drizzle-orm";
import { assignedToTickets } from "./1756799570_assigned_to_tickets";
import { labeledTickets } from "./1756799422_labeled_tickets";
import { subTickets } from "./1756799654_sub_tickets";
import { ticketReplies } from "./1756799727_ticket_replies";

export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  title: varchar("title").notNull(),
  description: text("description"),
  phaseId: uuid("phase_id")
    .notNull()
    .references(() => ticketPhases.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  referenceCode: varchar("reference_code", { length: 5 }).notNull(),
  startDate: timestamp("start_date"),
  dueDate: timestamp("due_date"),
  // labels: text("labels").array().default([]),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  assignedToTickets: many(assignedToTickets),
  labeledTickets: many(labeledTickets),
  author: one(users, { fields: [tickets.createdBy], references: [users.id] }),
  project: one(projects, {
    fields: [tickets.projectId],
    references: [projects.id],
  }),
  phase: one(ticketPhases, {
    fields: [tickets.phaseId],
    references: [ticketPhases.id],
  }),
  subTickets: many(subTickets),
  ticketReplies: many(ticketReplies),
}));
