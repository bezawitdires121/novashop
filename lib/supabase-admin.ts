import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jklkuulrjvxhwqxpisax.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
