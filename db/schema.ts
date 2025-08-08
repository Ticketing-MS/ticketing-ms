import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
  uuid,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import { unique } from "drizzle-orm/pg-core";

// --- Users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at", { mode: "date" }),
  team: text("team").default("user").notNull(),
  access: text("access").array().default([]),
  avatarUrl: text("avatar_url"),
});

// --- Categories
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});

// --- Priorities
export const priorities = pgTable("priorities", {
  id: uuid("id").primaryKey().defaultRandom(),
  level: varchar("level", { length: 20 }).notNull().unique(), // e.g., low | medium | high
});

// --- Projects
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 100 }).notNull(),
    name: text("name").notNull(),
    description: text("description"),
    team: text("team").notNull(),
    createdBy: uuid("created_by").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueSlugPerTeam: unique().on(table.slug, table.team),
  })
);

// --- Tickets
export const tickets = pgTable(
  "tickets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    description: text("description").notNull(),
    status: text("status").default("").notNull(),
    statusId: uuid("status_id")
      .notNull()
      .references(() => ticketStatuses.id, { onDelete: "set null" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    priorityId: uuid("priority_id").references(() => priorities.id, {
      onDelete: "set null",
    }),
    assignedTo: uuid("assigned_to").references(() => users.id, {
      onDelete: "set null",
    }),
    referenceCode: varchar("reference_code", { length: 20 }).notNull().unique(),
    createdBy: uuid("created_by").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    team: text("team").notNull().default("cloud"),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    dueDate: timestamp("due_date"),
    labels: text("labels").array().default([]),
  },
  (table) => ({
    uniqueSlugPerProject: unique().on(table.slug, table.projectId),
  })
);

// --- Ticket Statuses
export const ticketStatuses = pgTable("ticket_statuses", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 50 }).notNull(),
  order: integer("order").default(0), // optional, buat urutan
});

// --- Ticket Labels
export const ticketLabels = pgTable(
  "ticket_labels",
  {
    ticketId: uuid("ticket_id")
      .notNull()
      .references(() => tickets.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.ticketId, table.label] }),
  })
);

// --- Ticket Replies
export const ticketReplies = pgTable("ticket_replies", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketId: uuid("ticket_id")
    .notNull()
    .references(() => tickets.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- Attachments
export const attachments = pgTable("attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketId: uuid("ticket_id")
    .notNull()
    .references(() => tickets.id, { onDelete: "cascade" }),
  fileUrl: text("file_url").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});
