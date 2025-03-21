
import { supabase } from "@/lib/supabase";
import { UserFormData } from "../types";
import { Profile } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { createUser } from "@/routes/api/createUser";

export const handleCreateUser = async (data: UserFormData) => {
  try {
    // Get the current user's ID to use as created_by
    const { data: userData } = await supabase.auth.getUser();
    const createdBy = userData?.user?.id || "";

    // Use the createUser helper function that properly constructs the URL
    const responseData = await createUser({
      email: data.email,
      fullName: data.full_name,
      userType: data.user_type,
      userGroup: data.user_group,
      phoneNumber: data.phone_number,
      icNumber: data.ic_number,
      password: data.password,
      createdBy: createdBy
    });

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
