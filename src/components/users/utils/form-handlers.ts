
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
  // Instead of using auth.signUp, we'll create the user records directly
  
  // 1. Generate a random UUID for the new user
  const userId = crypto.randomUUID();
  const currentUserId = (await supabase.auth.getUser()).data.user?.id;
  
  if (!currentUserId) {
    throw new Error("Current user not found. Please log in again.");
  }
  
  try {
    // 2. Insert the user profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      email: data.email,
      full_name: data.full_name,
      user_type: data.user_type,
      phone_number: data.phone_number,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (profileError) throw profileError;

    // 3. Insert the user record
    const { error: userError } = await supabase.from("users").insert({
      id: userId,
      email: data.email,
      phone_number: data.phone_number,
      created_by: currentUserId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (userError) throw userError;

    // 4. Send an invitation email via a custom function or API
    // This would typically be handled by a Supabase Edge Function
    // For now, we'll just return the user data
    
    return {
      user: {
        id: userId,
        email: data.email,
      }
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
