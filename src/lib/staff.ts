
import { supabase } from "./supabase";

export async function createStaffMember(staffData: any) {
  try {
    // 1. Create auth user through regular signup
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: staffData.email,
      password: generateTemporaryPassword(),
      options: {
        data: {
          full_name: staffData.name,
          user_type: staffData.userType,
        },
        // Don't require email verification for staff accounts
        emailRedirectTo: `${window.location.origin}/dashboard/hr`,
      },
    });

    if (authError) throw authError;

    // Verify that we're only creating staff_manager or staff_assistant_manager
    if (staffData.userType !== 'staff_manager' && staffData.userType !== 'staff_assistant_manager') {
      throw new Error('Only staff_manager and staff_assistant_manager user types are allowed');
    }

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

    // 4. Update profiles table
    const { error: profilesError } = await supabase
      .from('profiles')
      .upsert({
        id: authUser.user?.id,
        email: staffData.email,
        full_name: staffData.name,
        user_type: staffData.userType,
        ic_number: staffData.ic_number,
        phone_number: staffData.phone_number
      });

    if (profilesError) throw profilesError;

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
