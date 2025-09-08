ALTER TABLE "auth_users" RENAME COLUMN "login_from" TO "user_agent";--> statement-breakpoint
ALTER TABLE "auth_users" ALTER COLUMN "refresh_token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_users" ALTER COLUMN "expires_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_users" ADD COLUMN "revoked_at" timestamp;--> statement-breakpoint
ALTER TABLE "auth_users" ADD COLUMN "replaced_by" varchar;--> statement-breakpoint
ALTER TABLE "auth_users" DROP COLUMN "access_token";--> statement-breakpoint
ALTER TABLE "auth_users" DROP COLUMN "last_login";