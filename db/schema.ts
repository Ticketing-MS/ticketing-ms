import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';


// --- Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: text('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  phone: varchar('phone', { length: 20 }),
  access: text('access').array().default([]),
});

// --- Categories
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
});

// --- Priorities
export const priorities = pgTable('priorities', {
  id: serial('id').primaryKey(),
  level: varchar('level', { length: 20 }).notNull().unique(),
});

// --- Tickets
export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  status: text('status').default('open').notNull(), // 'open' | 'in_progress' | 'closed'
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  priorityId: integer('priority_id').references(() => priorities.id, { onDelete: 'set null' }),
  assignedTo: integer('assigned_to').references(() => users.id, { onDelete: 'set null' }),
  referenceCode: varchar('reference_code', { length: 20 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(), // drizzle belum support ON UPDATE CURRENT_TIMESTAMP
});

// --- Ticket Replies
export const ticketReplies = pgTable('ticket_replies', {
  id: serial('id').primaryKey(),
  ticketId: integer('ticket_id')
    .notNull()
    .references(() => tickets.id, { onDelete: 'cascade' }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// --- Attachments
export const attachments = pgTable('attachments', {
  id: serial('id').primaryKey(),
  ticketId: integer('ticket_id')
    .notNull()
    .references(() => tickets.id, { onDelete: 'cascade' }),
  fileUrl: text('file_url').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});
