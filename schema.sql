


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."addresses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "full_name" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "address_line1" "text" NOT NULL,
    "address_line2" "text",
    "city" "text" NOT NULL,
    "state" "text" NOT NULL,
    "pincode" "text" NOT NULL,
    "address_type" "text" DEFAULT 'Home'::"text",
    "is_default" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "landmark" "text",
    "alternate_phone" "text"
);


ALTER TABLE "public"."addresses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."banners" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "subtitle" "text",
    "button_text" "text",
    "button_link" "text",
    "image_url" "text",
    "background_color" "text",
    "display_order" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."banners" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cart_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "text" NOT NULL,
    "product_id" "uuid",
    "quantity" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."cart_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "text" NOT NULL,
    "sender" "text" DEFAULT 'customer'::"text" NOT NULL,
    "message" "text" NOT NULL,
    "is_inquiry" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."chat_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."home_promo_banners" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "subtitle" "text",
    "button_text" "text",
    "button_link" "text",
    "emoji" "text",
    "background" "text",
    "sort_order" integer DEFAULT 1,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "image_url" "text"
);


ALTER TABLE "public"."home_promo_banners" OWNER TO "postgres";


ALTER TABLE "public"."home_promo_banners" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."home_promo_banners_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid" NOT NULL,
    "product_id" "uuid",
    "product_name" "text" NOT NULL,
    "product_price" numeric NOT NULL,
    "quantity" integer NOT NULL,
    "subtotal" numeric NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_number" "text" NOT NULL,
    "customer_name" "text" NOT NULL,
    "customer_email" "text" NOT NULL,
    "customer_phone" "text" NOT NULL,
    "delivery_address" "text" NOT NULL,
    "city" "text" NOT NULL,
    "postal_code" "text" NOT NULL,
    "total_amount" numeric NOT NULL,
    "payment_method" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text" NOT NULL,
    "short_description" "text" NOT NULL,
    "price" numeric NOT NULL,
    "image_url" "text" NOT NULL,
    "additional_images" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "category_id" "uuid",
    "stock_quantity" integer DEFAULT 0 NOT NULL,
    "in_stock" boolean DEFAULT true NOT NULL,
    "featured" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "price_usd" numeric,
    "video_url" "text",
    "specifications" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "sku" "text",
    "mrp" numeric(10,2)
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text",
    "phone" "text" NOT NULL,
    "address" "text",
    "city" "text",
    "state" "text",
    "pincode" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "gender" "text"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON COLUMN "public"."profiles"."gender" IS 'text';



CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_name" "text" NOT NULL,
    "rating" integer NOT NULL,
    "review_text" "text" NOT NULL,
    "featured" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."shop_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "image_url" "text",
    "button_text" "text",
    "button_link" "text",
    "display_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "subtitle" "text"
);


ALTER TABLE "public"."shop_categories" OWNER TO "postgres";


ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."banners"
    ADD CONSTRAINT "banners_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."home_promo_banners"
    ADD CONSTRAINT "home_promo_banners_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_order_number_key" UNIQUE ("order_number");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shop_categories"
    ADD CONSTRAINT "shop_categories_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_banners_active" ON "public"."banners" USING "btree" ("is_active");



CREATE INDEX "idx_banners_display_order" ON "public"."banners" USING "btree" ("display_order");



CREATE INDEX "idx_cart_session" ON "public"."cart_items" USING "btree" ("session_id");



CREATE INDEX "idx_categories_slug" ON "public"."categories" USING "btree" ("slug");



CREATE INDEX "idx_chat_messages_session_id" ON "public"."chat_messages" USING "btree" ("session_id");



CREATE INDEX "idx_orders_number" ON "public"."orders" USING "btree" ("order_number");



CREATE INDEX "idx_products_category" ON "public"."products" USING "btree" ("category_id");



CREATE INDEX "idx_products_featured" ON "public"."products" USING "btree" ("featured");



CREATE INDEX "idx_products_slug" ON "public"."products" USING "btree" ("slug");



CREATE INDEX "idx_reviews_featured" ON "public"."reviews" USING "btree" ("featured");



CREATE INDEX "idx_shop_categories_order" ON "public"."shop_categories" USING "btree" ("display_order");



CREATE UNIQUE INDEX "products_sku_idx" ON "public"."products" USING "btree" ("sku") WHERE ("sku" IS NOT NULL);



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow all operations on shop_categories" ON "public"."shop_categories" USING (true) WITH CHECK (true);



CREATE POLICY "Anyone can create order items" ON "public"."order_items" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can create orders" ON "public"."orders" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can delete banners" ON "public"."banners" FOR DELETE TO "authenticated", "anon" USING (true);



CREATE POLICY "Anyone can delete categories" ON "public"."categories" FOR DELETE TO "authenticated", "anon" USING (true);



CREATE POLICY "Anyone can delete products" ON "public"."products" FOR DELETE TO "authenticated", "anon" USING (true);



CREATE POLICY "Anyone can insert banners" ON "public"."banners" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "Anyone can insert categories" ON "public"."categories" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "Anyone can insert products" ON "public"."products" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "Anyone can update banners" ON "public"."banners" FOR UPDATE TO "authenticated", "anon" USING (true) WITH CHECK (true);



CREATE POLICY "Anyone can update categories" ON "public"."categories" FOR UPDATE TO "authenticated", "anon" USING (true) WITH CHECK (true);



CREATE POLICY "Anyone can update products" ON "public"."products" FOR UPDATE TO "authenticated", "anon" USING (true) WITH CHECK (true);



CREATE POLICY "Anyone can view banners" ON "public"."banners" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Anyone can view categories" ON "public"."categories" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Anyone can view featured reviews" ON "public"."reviews" FOR SELECT USING (("featured" = true));



CREATE POLICY "Anyone can view products" ON "public"."products" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Users can delete own cart items" ON "public"."cart_items" FOR DELETE USING (true);



CREATE POLICY "Users can delete their own addresses" ON "public"."addresses" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert cart items" ON "public"."cart_items" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can insert own profile" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can insert their own addresses" ON "public"."addresses" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own cart items" ON "public"."cart_items" FOR UPDATE USING (true) WITH CHECK (true);



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own addresses" ON "public"."addresses" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own cart items" ON "public"."cart_items" FOR SELECT USING (true);



CREATE POLICY "Users can view own profile" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own addresses" ON "public"."addresses" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."addresses" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "anon_delete_chat_messages" ON "public"."chat_messages" FOR DELETE TO "authenticated", "anon" USING (true);



CREATE POLICY "anon_insert_chat_messages" ON "public"."chat_messages" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "anon_select_chat_messages" ON "public"."chat_messages" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "anon_update_chat_messages" ON "public"."chat_messages" FOR UPDATE TO "authenticated", "anon" USING (true) WITH CHECK (true);



ALTER TABLE "public"."banners" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cart_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shop_categories" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON TABLE "public"."addresses" TO "anon";
GRANT ALL ON TABLE "public"."addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."addresses" TO "service_role";



GRANT ALL ON TABLE "public"."banners" TO "anon";
GRANT ALL ON TABLE "public"."banners" TO "authenticated";
GRANT ALL ON TABLE "public"."banners" TO "service_role";



GRANT ALL ON TABLE "public"."cart_items" TO "anon";
GRANT ALL ON TABLE "public"."cart_items" TO "authenticated";
GRANT ALL ON TABLE "public"."cart_items" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."chat_messages" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages" TO "service_role";



GRANT ALL ON TABLE "public"."home_promo_banners" TO "anon";
GRANT ALL ON TABLE "public"."home_promo_banners" TO "authenticated";
GRANT ALL ON TABLE "public"."home_promo_banners" TO "service_role";



GRANT ALL ON SEQUENCE "public"."home_promo_banners_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."home_promo_banners_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."home_promo_banners_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



GRANT ALL ON TABLE "public"."shop_categories" TO "anon";
GRANT ALL ON TABLE "public"."shop_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."shop_categories" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







