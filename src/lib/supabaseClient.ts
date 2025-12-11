import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("DEBUG → supabaseUrl =", supabaseUrl);
console.log("DEBUG → supabaseAnonKey starts with =", supabaseAnonKey?.slice(0, 5));

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase env variables are missing!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);