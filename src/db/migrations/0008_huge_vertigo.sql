ALTER TABLE "users" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone_otp" varchar(10);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone_otp_expires" timestamp;