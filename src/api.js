// api.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are not configured.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// --- AUTH FUNCTIONS ---

export async function registerUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function loginUser(email, password) {
  console.log("Attempt login with:", email, password);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password,
  });

  if (error) throw error;
  return data;
}


export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
