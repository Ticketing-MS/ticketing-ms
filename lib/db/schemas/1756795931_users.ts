import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
  uuid,
} from "drizzle-orm/pg-core";
import { roles } from "./1756793496_roles";
import { relations } from "drizzle-orm";
import { usersToTeams } from "./1756795998_users_to_teams";
import { authUsers } from "./1756796035_auth_users";
import { assignedToProjects } from "./1756796140_assigned_to_projects";
import { projects } from "./1756796090_projects";
import { tickets } from "./1756798749_tickets";
import { assignedToTickets } from "./1756799570_assigned_to_tickets";
import { ticketReplies } from "./1756799727_ticket_replies";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email").notNull().unique(),
  name: varchar("name").notNull(),
  password: varchar("password").notNull(),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").notNull().default(true),
  roleId: uuid("role_id").references(() => roles.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  usersToTeams: many(usersToTeams),
  auth: many(authUsers),
  projects: many(projects),
  assignedToProjects: many(assignedToProjects),
  tickets: many(tickets),
  assignedToTickets: many(assignedToTickets),
  ticketReplies: many(ticketReplies),
}));
