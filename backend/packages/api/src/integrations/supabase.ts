import { createClient } from "@supabase/supabase-js";
import type { Database } from "@ondeckai/shared/database.types";
import dotenv from "dotenv";
dotenv.config();


export const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);