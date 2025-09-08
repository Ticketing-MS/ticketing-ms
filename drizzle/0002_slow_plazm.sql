ALTER TABLE "assigned_projects" ALTER COLUMN "project_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "assigned_projects" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "labeled_tickets" ALTER COLUMN "ticket_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "labeled_tickets" ALTER COLUMN "ticket_label_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "assigned_tickets" ALTER COLUMN "ticket_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "assigned_tickets" ALTER COLUMN "user_id" SET NOT NULL;