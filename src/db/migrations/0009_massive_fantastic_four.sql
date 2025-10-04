ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_poduct_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_items" ADD COLUMN "product_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_phone_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" DROP COLUMN "poduct_id";