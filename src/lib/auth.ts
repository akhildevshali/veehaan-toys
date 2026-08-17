import { supabase } from "./supabase";

export async function signUp(email: string, password: string) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/complete-profile`,
    },
  });
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export async function resetPassword(email: string, redirectTo: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
}

export async function updatePassword(password: string) {
  return await supabase.auth.updateUser({
    password,
  });
}