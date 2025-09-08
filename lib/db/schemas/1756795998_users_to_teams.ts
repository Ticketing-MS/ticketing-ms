import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { teams } from "./1756793527_teams";
import { users } from "./1756795931_users";
import { relations } from "drizzle-orm";

export const usersToTeams = pgTable(
  "users_to_teams",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.teamId] })]
);

export const usersToTeamsRelations = relations(usersToTeams, ({ one }) => ({
  user: one(users, { fields: [usersToTeams.userId], references: [users.id] }),
  team: one(teams, { fields: [usersToTeams.teamId], references: [teams.id] }),
}));
