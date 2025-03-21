
import { supabase } from "./supabase";

export async function createStaffMember(staffData: any) {
  try {
    // 1. Create auth user
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: staffData.email,
      password: generateTemporaryPassword(), // You would implement this
      options: {
        data: {
          full_name: staffData.name,
          user_type: staffData.userType,
        },
      },
    });

    if (authError) throw authError;

    // 2. Create staff profile
    const { data: staffProfile, error: profileError } = await supabase
      .from('nd_staff_profile')
      .insert({
        user_id: authUser.user?.id,
        fullname: staffData.name,
        ic_no: staffData.ic_number,
        mobile_no: staffData.phone_number,
        work_email: staffData.email,
        is_active: staffData.status === 'Active',
      })
      .select()
      .single();

    if (profileError) throw profileError;

    // 3. Create staff job record
    const { error: jobError } = await supabase
      .from('nd_staff_job')
      .insert({
        staff_id: staffProfile.id,
        site_id: staffData.siteLocation,
        join_date: staffData.employDate,
        is_active: true,
      });

    if (jobError) throw jobError;

    return { success: true, data: staffProfile };
  } catch (error) {
    console.error('Error creating staff member:', error);
    throw error;
  }
}

function generateTemporaryPassword() {
  // Generate a random password that meets your requirements
  return Math.random().toString(36).slice(-10) + 'A1!';
}
