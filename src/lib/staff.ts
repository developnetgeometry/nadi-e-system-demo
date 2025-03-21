
import { supabase } from "./supabase";

export async function createStaffMember(staffData: any) {
  try {
    // Get current user to check permissions
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      throw new Error('Authentication required');
    }
    
    // Get current user's type from profiles
    const { data: currentUserProfile, error: userProfileError } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', currentUser.id)
      .single();
      
    if (userProfileError) {
      throw new Error('Error fetching user profile');
    }
    
    // Check if current user is authorized to create staff
    const allowedCreatorTypes = ['tp_admin', 'tp_hr', 'super_admin'];
    if (!allowedCreatorTypes.includes(currentUserProfile.user_type)) {
      throw new Error('User not allowed to create staff members');
    }
    
    // Verify that we're only creating staff_manager or staff_assistant_manager
    const allowedStaffTypes = ['staff_manager', 'staff_assistant_manager'];
    if (!allowedStaffTypes.includes(staffData.userType)) {
      throw new Error('Only staff_manager and staff_assistant_manager user types are allowed');
    }

    // 1. Create auth user through regular signup
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: staffData.email,
      password: generateTemporaryPassword(),
      options: {
        data: {
          full_name: staffData.name,
          user_type: staffData.userType, // Make sure user_type is set correctly from form data
        },
        emailRedirectTo: `${window.location.origin}/dashboard/hr`,
      },
    });

    if (authError) throw authError;

    console.log("Created auth user with type:", staffData.userType);

    // 2. Create staff profile - Fixed to not reference user_id but instead store auth.user.id correctly
    const { data: staffProfile, error: staffProfileError } = await supabase
      .from('nd_staff_profile')
      .insert({
        user_id: authUser.user?.id, // This should match the column name in nd_staff_profile
        fullname: staffData.name,
        ic_no: staffData.ic_number,
        mobile_no: staffData.phone_number,
        work_email: staffData.email,
        is_active: staffData.status === 'Active',
      })
      .select()
      .single();

    if (staffProfileError) {
      console.error('Staff profile creation error:', staffProfileError);
      // Log detailed error information to help troubleshoot
      console.error('Error details:', JSON.stringify(staffProfileError, null, 2));
      throw new Error(`Error creating staff profile: ${staffProfileError.message}`);
    }

    // 3. Create staff job record with the site location
    const { error: jobError } = await supabase
      .from('nd_staff_job')
      .insert({
        staff_id: staffProfile.id,
        site_id: staffData.siteLocation, // Store the site location ID
        join_date: staffData.employDate,
        is_active: true,
      });

    if (jobError) {
      console.error('Staff job creation error:', jobError);
      throw jobError;
    }

    // 4. Update profiles table with the correct user_type
    const { error: profilesError } = await supabase
      .from('profiles')
      .upsert({
        id: authUser.user?.id,
        email: staffData.email,
        full_name: staffData.name,
        user_type: staffData.userType, // Explicitly set the user_type
        ic_number: staffData.ic_number,
        phone_number: staffData.phone_number
      });

    if (profilesError) {
      console.error('Profile update error:', profilesError);
      throw profilesError;
    }

    console.log("Successfully created staff with user type:", staffData.userType);
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
