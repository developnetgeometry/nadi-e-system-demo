
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
  // We need to create a user without using auth.signUp to avoid replacing the current session
  
  const currentUser = (await supabase.auth.getUser()).data.user;
  
  if (!currentUser) {
    throw new Error("Current user not found. Please log in again.");
  }
  
  try {
    // 1. Create the user directly in the database using a server-side function/RPC
    // Note: This requires a server function with proper admin rights
    // For now, we'll simulate this with a direct call
    
    // This is a placeholder - in a real implementation, you would call a
    // Supabase Edge Function that uses the admin API to create users
    const { data: newUser, error } = await supabase.functions.invoke('create-user', {
      body: {
        email: data.email,
        fullName: data.full_name,
        userType: data.user_type,
        phoneNumber: data.phone_number,
        createdBy: currentUser.id
      }
    });
    
    if (error) throw error;
    if (!newUser) throw new Error("Failed to create user");

    return { user: newUser };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
