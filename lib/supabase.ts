import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jklkuulrjvxhwqxpisax.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGt1dWxyanZ4aHdxeHBpc2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNDg5NzcsImV4cCI6MjA5NjcyNDk3N30.gl5vlNuSTRtzVVyK2ihNhhE_CfA1Ga4G8oKNJHSmJD4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);