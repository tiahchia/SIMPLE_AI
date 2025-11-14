// api.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are not configured.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- AUTH FUNCTIONS ---

// Register a new user
export async function registerUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Login existing user (email + password)
export async function loginUser(email, password) {
  console.log("Attempting login with:", email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error);
    throw error;
  }

  return data;
}

// Get current session
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}
