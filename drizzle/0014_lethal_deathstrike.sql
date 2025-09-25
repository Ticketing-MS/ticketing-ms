ALTER TABLE "users_to_teams" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sub_tickets" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users_to_teams" CASCADE;--> statement-breakpoint
DROP TABLE "sub_tickets" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "team_id" uuid;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "parent_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE cascade;