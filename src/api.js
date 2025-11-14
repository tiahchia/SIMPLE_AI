import { createClient } from '@supabase/supabase-js';

// Use REACT_APP_... for Create React App
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Your API backend (can stay the same)
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are not configured.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function registerUser(username, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (error) throw error;
  return data;
}

export async function loginUser(identifier, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: identifier,
    password,
  });

  if (error) throw error;
  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session?.access_token ?? null;
}

export async function fetchSessionProfile() {
  const token = await getAccessToken();
  if (!token) return null;

  const response = await fetch(`${apiBaseUrl}/auth/session`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return null;
  return response.json();
}

export async function sendMessage(message) {
  const token = await getAccessToken();
  if (!token) throw new Error('User is not authenticated.');

  const response = await fetch(`${apiBaseUrl}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Failed to send message.');
  }

  return response.json().then(payload => payload.reply);
}

export async function fetchConversations() {
  const token = await getAccessToken();
  if (!token) throw new Error('User is not authenticated.');

  const response = await fetch(`${apiBaseUrl}/chat/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Unable to load conversation history.');
  }

  return response.json().then(payload => payload.conversations);
}
