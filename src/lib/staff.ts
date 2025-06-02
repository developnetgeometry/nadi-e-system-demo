import { supabase } from "./supabase";

export async function createStaffMember(staffData: any) {
  try {
    // Get current user to check permissions
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      throw new Error("Authentication required");
    }

    // Get current user's type from profiles
    const { data: currentUserProfile, error: userProfileError } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", currentUser.id)
      .single();

    if (userProfileError) {
      throw new Error("Error fetching user profile");
    }

    // Check if current user is authorized to create staff
    const allowedCreatorTypes = ["tp_admin", "tp_hr", "super_admin"];
    if (!allowedCreatorTypes.includes(currentUserProfile.user_type)) {
      throw new Error("User not allowed to create staff members");
    }

    // Verify that we're only creating staff_manager or staff_assistant_manager
    const allowedStaffTypes = ["staff_manager", "staff_assistant_manager"];
    if (!allowedStaffTypes.includes(staffData.userType)) {
      throw new Error(
        "Only staff_manager and staff_assistant_manager user types are allowed"
      );
    }

    // 1. Create auth user through admin API instead of regular signup
    // This prevents session switching
    const { data: authUser, error: authError } =
      await supabase.functions.invoke("create-user", {
        body: {
          email: staffData.email,
          password: generateTemporaryPassword(),
          fullName: staffData.name,
          userType: staffData.userType,
          icNumber: staffData.ic_number,
          phoneNumber: staffData.phone_number,
          userGroup: 6, // Assuming 6 is the user group for center staff
          createdBy: currentUser.id,
        },
      });

    if (authError) {
      console.error("Error creating auth user:", authError);
      throw new Error(`Error creating auth user: ${authError.message}`);
    }

    if (!authUser || !authUser.id) {
      throw new Error("Failed to create user account");
    }

    console.log("Created auth user with type:", staffData.userType);

    // Current timestamp for standardization
    const timestamp = new Date().toISOString();

    // Metadata object used in all INSERT operations
    const metaData = {
      created_by: currentUser.id,
      created_at: timestamp,
      updated_by: currentUser.id,
      updated_at: timestamp,
    };

    // 2. Create staff profile - Ensure proper data types are used and add metadata
    const { data: staffProfile, error: staffProfileError } = await supabase
      .from("nd_staff_profile")
      .insert({
        user_id: authUser.id,
        fullname: staffData.name,
        ic_no: staffData.ic_number,
        mobile_no: staffData.phone_number,
        work_email: staffData.email,
        personal_email: staffData.personal_email,
        qualification: staffData.qualification,
        dob: staffData.dob,
        place_of_birth: staffData.place_of_birth,
        marital_status: staffData.marital_status,
        race_id: staffData.race_id,
        religion_id: staffData.religion_id,
        nationality_id: staffData.nationality_id,
        gender_id: staffData.gender_id,
        height: staffData.height,
        weight: staffData.weight,
        is_active: staffData.status === "Active",
        ...metaData, // Add standard metadata
      })
      .select()
      .single();

    if (staffProfileError) {
      console.error("Staff profile creation error:", staffProfileError);
      // Log detailed error information to help troubleshoot
      console.error(
        "Error details:",
        JSON.stringify(staffProfileError, null, 2)
      );
      throw new Error(
        `Error creating staff profile: ${staffProfileError.message}`
      );
    }

    // 3. Create staff job record with the site location
    // The site_id column expects a bigint, make sure staffData.siteLocation is a number
    // If it's a string, convert it to an integer
    const siteLocationId =
      typeof staffData.siteLocation === "string"
        ? parseInt(staffData.siteLocation, 10)
        : staffData.siteLocation;

    if (isNaN(siteLocationId)) {
      console.error("Invalid site location ID:", staffData.siteLocation);
      throw new Error("Invalid site location ID format");
    }

    console.log(
      "Creating staff job with site ID:",
      siteLocationId,
      "and staff profile ID:",
      staffProfile.id
    );

    let position_id;
    if (staffData.userType == "staff_manager") {
      position_id = 1; // Assuming 1 is the ID for staff_manager
    } else if (staffData.userType == "staff_assistant_manager") {
      position_id = 2; // Assuming 2 is the ID for staff_assistant_manager
    }

    const { data: staffJob, error: jobError } = await supabase
      .from("nd_staff_job")
      .insert({
        staff_id: staffProfile.id, // This is a UUID
        site_id: siteLocationId, // Make sure this is properly converted to a bigint
        position_id: position_id,
        join_date: staffData.employDate,
        is_active: staffData.status === "Active",
        ...metaData, // Add standard metadata
      })
      .select("id") // to retrieve the job_id
      .single();

    if (jobError) {
      console.error("Staff job creation error:", jobError);
      throw jobError;
    }

    // Initialize other staff-related tables that we want to provision with this staff member

    // Create empty staff pay info record
    const { data: staffPayInfo, error: payInfoError } = await supabase
      .from("nd_staff_pay_info")
      .insert({
        staff_id: staffProfile.id,
        bank_id: staffData.bank_name,
        bank_acc_no: staffData.bank_account_no,
        epf_no: staffData.epf_no,
        socso_no: staffData.socso_no,
        tax_no: staffData.income_tax_no,
        ...metaData,
      })
      .select("id")
      .single();

    if (payInfoError) {
      console.error("Staff pay info creation error:", payInfoError);
      // Not throwing, as this is a non-critical error
    }

    // Create default staff address record (empty)
    const { error: addressError } = await supabase
      .from("nd_staff_address")
      .insert({
        staff_id: staffProfile.id,
        is_active: true,
        permanent_address1: staffData.permanent_address1,
        permanent_address2: staffData.permanent_address2,
        permanent_postcode: staffData.permanent_postcode,
        permanent_city_id: staffData.permanent_city,
        permanent_state_id: staffData.permanent_state,
        correspondence_address1: staffData.correspondence_address1,
        correspondence_address2: staffData.correspondence_address2,
        correspondence_postcode: staffData.correspondence_postcode,
        correspondence_city_id: staffData.correspondence_city,
        correspondence_state_id: staffData.correspondence_state,
        ...metaData,
      });

    if (addressError) {
      console.error("Staff address creation error:", addressError);
      // Not throwing, as this is a non-critical error
    }

    // get Site Profile Details
    const { data: siteProfile, error: siteProfileError } = await supabase
      .from("nd_site_profile")
      .select("id,phase_id")
      .eq("id", siteLocationId)
      .single();
    if (siteProfileError) {
      console.error("Error fetching site profile:", siteProfileError);
      throw new Error("Error fetching site profile");
    }

    // Create staff contract record

    const { error: contractError } = await supabase
      .from("nd_staff_contract")
      .insert({
        staff_id: staffProfile.id,
        is_active: staffData.status === "Active",
        site_id: siteLocationId,
        site_profile_id: siteProfile.id,
        phase_id: siteProfile.phase_id,
        contract_start: staffData.contractStartDate,
        contract_end: staffData.contractEndDate,
        contract_type: 1,
        duration:
          staffData.contractStartDate && staffData.contractEndDate
            ? Math.ceil(
                (new Date(staffData.contractEndDate).getTime() -
                  new Date(staffData.contractStartDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            : null,
        user_id: authUser.id,
        ...metaData,
      });

    if (contractError) {
      console.error("Staff contact creation error:", contractError);
      // Not throwing, as this is a non-critical error
    }

    const { error: updateProfileDataError } = await supabase
      .from("nd_staff_profile")
      .update({
        job_id: staffJob?.id,
        staff_pay_id: staffPayInfo?.id,
        position_id: position_id,
        updated_by: currentUser.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", staffProfile.id);

    if (updateProfileDataError) {
      console.error(
        "Error updating staff profile with job and pay info:",
        updateProfileDataError
      );
      throw new Error("Error updating staff profile with job and pay info");
    }

    console.log(
      "Successfully created staff with user type:",
      staffData.userType
    );
    return { success: true, data: staffProfile };
  } catch (error) {
    console.error("Error creating staff member:", error);
    throw error;
  }
}

function generateTemporaryPassword() {
  // Generate a random password that meets your requirements
  return Math.random().toString(36).slice(-10) + "A1!";
}
