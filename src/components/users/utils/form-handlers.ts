import { supabase } from "@/lib/supabase";
import { UserFormData } from "../types";
import { Profile } from "@/types/auth";

export async function handleUpdateUser(data: UserFormData, user: Profile) {
  // Update existing user
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      user_type: data.user_type,
      phone_number: data.phone_number,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) throw profileError;

  // Update user table
  const { error: userError } = await supabase
    .from("users")
    .update({
      phone_number: data.phone_number,
      updated_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .eq("id", user.id);

  if (userError) throw userError;
}

export async function handleCreateUser(data: UserFormData) {
  // Create new user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: Math.random().toString(36).slice(-8), // Generate random password
  });

  if (authError) throw authError;
  if (!authData.user?.id) throw new Error("No user ID returned");

  // Create profile
  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    email: data.email,
    full_name: data.full_name,
    user_type: data.user_type,
    phone_number: data.phone_number,
  });

  if (profileError) throw profileError;

  // Create user record
  const { error: userError } = await supabase.from("users").insert({
    id: authData.user.id,
    email: data.email,
    phone_number: data.phone_number,
    created_by: (await supabase.auth.getUser()).data.user?.id,
  });

  if (userError) throw userError;

  return authData;
}