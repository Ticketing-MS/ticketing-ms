import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// --- Users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: text("role").default("user").notNull(), // user | admin | staff
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true),
  team: text("team").array().default([]), // e.g., ["cloud", "devops"]
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

// --- Tickets
export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  status: text("status").default("open").notNull(), // 'open' | 'in_progress' | 'closed'
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  team: text("team").notNull().default("cloud"),
});

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
