
import { supabase } from "@/lib/supabase";
import { UserFormData } from "../types";
import { Profile } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

export const handleCreateUser = async (data: UserFormData) => {
  try {
    // Get the current user's ID to use as created_by
    const { data: userData } = await supabase.auth.getUser();
    const createdBy = userData?.user?.id || "";

    const response = await fetch('/api/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        fullName: data.full_name,
        userType: data.user_type,
        userGroup: data.user_group,
        phoneNumber: data.phone_number,
        icNumber: data.ic_number,
        password: data.password,
        createdBy: createdBy
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create user';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (jsonError) {
        // If JSON parsing fails, use status text
        errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const handleUpdateUser = async (data: UserFormData, user: Profile) => {
  // Update existing user
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      user_type: data.user_type,
      user_group: data.user_group,
      phone_number: data.phone_number,
      ic_number: data.ic_number,
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
};
