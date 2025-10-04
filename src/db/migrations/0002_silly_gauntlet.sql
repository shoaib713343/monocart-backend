CREATE TYPE "public"."role" AS ENUM('admin', 'customer');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'customer' NOT NULL;