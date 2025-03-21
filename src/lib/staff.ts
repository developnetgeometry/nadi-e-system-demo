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
    const allowedCreatorTypes = ["tp_admin", "tp_hr", "super_admin", "staff_manager"];
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
    const { data: authUser, error: authError } = await supabase.functions.invoke('create-user', {
      body: {
        email: staffData.email,
        password: generateTemporaryPassword(),
        fullName: staffData.name,
        userType: staffData.userType,
        icNumber: staffData.ic_number,
        phoneNumber: staffData.phone_number,
        createdBy: currentUser.id
      }
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
      updated_at: timestamp
    };

    // 2. Create staff profile - Ensure proper data types are used and add metadata
    const { data: staffProfile, error: staffProfileError } = await supabase
      .from("nd_staff_profile")
      .insert({
        user_id: authUser.id, // Should be UUID, not bigint
        fullname: staffData.name,
        ic_no: staffData.ic_number,
        mobile_no: staffData.phone_number,
        work_email: staffData.email,
        is_active: staffData.status === "Active",
        ...metaData  // Add standard metadata
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

    const { error: jobError } = await supabase.from("nd_staff_job").insert({
      staff_id: staffProfile.id, // This is a UUID
      site_id: siteLocationId, // Make sure this is properly converted to a bigint
      join_date: staffData.employDate,
      is_active: true,
      ...metaData  // Add standard metadata
    });

    if (jobError) {
      console.error("Staff job creation error:", jobError);
      throw jobError;
    }

    // Initialize other staff-related tables that we want to provision with this staff member
    
    // Create empty staff pay info record
    const { error: payInfoError } = await supabase.from("nd_staff_pay_info").insert({
      staff_id: staffProfile.id,
      ...metaData
    });
    
    if (payInfoError) {
      console.error("Staff pay info creation error:", payInfoError);
      // Not throwing, as this is a non-critical error
    }
    
    // Create default staff address record (empty)
    const { error: addressError } = await supabase.from("nd_staff_address").insert({
      staff_id: staffProfile.id,
      is_active: true,
      ...metaData
    });
    
    if (addressError) {
      console.error("Staff address creation error:", addressError);
      // Not throwing, as this is a non-critical error
    }
    
    // Create default staff contact (emergency contact) record (empty)
    const { error: contactError } = await supabase.from("nd_staff_contact").insert({
      staff_id: staffProfile.id,
      ...metaData
    });
    
    if (contactError) {
      console.error("Staff contact creation error:", contactError);
      // Not throwing, as this is a non-critical error
    }
    
    // Create initial staff contract record
    const { error: contractError } = await supabase.from("nd_staff_contract").insert({
      staff_id: staffProfile.id,
      is_active: true,
      site_id: siteLocationId,
      contract_start: staffData.employDate,
      user_id: authUser.id,
      ...metaData
    });
    
    if (contractError) {
      console.error("Staff contract creation error:", contractError);
      // Not throwing, as this is a non-critical error
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

export async function updateStaffMember(staffId: string, staffData: any) {
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

    // Check if current user is authorized to update staff
    const allowedCreatorTypes = ["tp_admin", "tp_hr", "super_admin", "staff_manager"];
    if (!allowedCreatorTypes.includes(currentUserProfile.user_type)) {
      throw new Error("User not allowed to update staff members");
    }

    // Current timestamp for update operations
    const timestamp = new Date().toISOString();
    
    // Metadata object for update operations
    const updateMetaData = {
      updated_by: currentUser.id,
      updated_at: timestamp
    };

    // Update staff profile
    if (staffData.profile) {
      const { error: profileError } = await supabase
        .from("nd_staff_profile")
        .update({
          fullname: staffData.profile.fullname,
          mobile_no: staffData.profile.mobile_no,
          personal_email: staffData.profile.personal_email,
          dob: staffData.profile.dob,
          place_of_birth: staffData.profile.place_of_birth,
          gender_id: staffData.profile.gender_id,
          marital_status: staffData.profile.marital_status,
          race_id: staffData.profile.race_id,
          religion_id: staffData.profile.religion_id,
          nationality_id: staffData.profile.nationality_id,
          ...updateMetaData
        })
        .eq("id", staffId);

      if (profileError) {
        console.error("Error updating staff profile:", profileError);
        throw new Error(`Error updating staff profile: ${profileError.message}`);
      }
    }

    // Update staff address
    if (staffData.address) {
      if (staffData.address.id) {
        // Update existing address
        const { error: addressError } = await supabase
          .from("nd_staff_address")
          .update({
            address1: staffData.address.address1,
            address2: staffData.address.address2,
            postcode: staffData.address.postcode,
            city: staffData.address.city,
            district_id: staffData.address.district_id,
            state_id: staffData.address.state_id,
            ...updateMetaData
          })
          .eq("id", staffData.address.id);

        if (addressError) {
          console.error("Error updating staff address:", addressError);
          throw new Error(`Error updating staff address: ${addressError.message}`);
        }
      } else {
        // Create new address if it doesn't exist
        const { error: addressError } = await supabase
          .from("nd_staff_address")
          .insert({
            staff_id: staffId,
            address1: staffData.address.address1,
            address2: staffData.address.address2,
            postcode: staffData.address.postcode,
            city: staffData.address.city,
            district_id: staffData.address.district_id,
            state_id: staffData.address.state_id,
            is_active: true,
            created_by: currentUser.id,
            created_at: timestamp,
            ...updateMetaData
          });

        if (addressError) {
          console.error("Error creating staff address:", addressError);
          throw new Error(`Error creating staff address: ${addressError.message}`);
        }
      }
    }

    // Update staff contact
    if (staffData.contact) {
      if (staffData.contact.id) {
        // Update existing contact
        const { error: contactError } = await supabase
          .from("nd_staff_contact")
          .update({
            full_name: staffData.contact.full_name,
            relationship_id: staffData.contact.relationship_id,
            mobile_no: staffData.contact.mobile_no,
            ic_no: staffData.contact.ic_no,
            total_children: staffData.contact.total_children,
            ...updateMetaData
          })
          .eq("id", staffData.contact.id);

        if (contactError) {
          console.error("Error updating staff contact:", contactError);
          throw new Error(`Error updating staff contact: ${contactError.message}`);
        }
      } else {
        // Create new contact if it doesn't exist
        const { error: contactError } = await supabase
          .from("nd_staff_contact")
          .insert({
            staff_id: staffId,
            full_name: staffData.contact.full_name,
            relationship_id: staffData.contact.relationship_id,
            mobile_no: staffData.contact.mobile_no,
            ic_no: staffData.contact.ic_no,
            total_children: staffData.contact.total_children,
            created_by: currentUser.id,
            created_at: timestamp,
            ...updateMetaData
          });

        if (contactError) {
          console.error("Error creating staff contact:", contactError);
          throw new Error(`Error creating staff contact: ${contactError.message}`);
        }
      }
    }

    // Update staff contract
    if (staffData.contract) {
      if (staffData.contract.id) {
        // Update existing contract
        const { error: contractError } = await supabase
          .from("nd_staff_contract")
          .update({
            site_id: staffData.contract.site_id,
            contract_start: staffData.contract.contract_start,
            contract_end: staffData.contract.contract_end,
            contract_type: staffData.contract.contract_type,
            is_active: staffData.contract.is_active,
            remark: staffData.contract.remark,
            ...updateMetaData
          })
          .eq("id", staffData.contract.id);

        if (contractError) {
          console.error("Error updating staff contract:", contractError);
          throw new Error(`Error updating staff contract: ${contractError.message}`);
        }
      } else {
        // Create new contract if it doesn't exist
        const { error: contractError } = await supabase
          .from("nd_staff_contract")
          .insert({
            staff_id: staffId,
            site_id: staffData.contract.site_id,
            contract_start: staffData.contract.contract_start,
            contract_end: staffData.contract.contract_end,
            contract_type: staffData.contract.contract_type,
            is_active: staffData.contract.is_active || true,
            remark: staffData.contract.remark,
            user_id: staffData.contract.user_id,
            created_by: currentUser.id,
            created_at: timestamp,
            ...updateMetaData
          });

        if (contractError) {
          console.error("Error creating staff contract:", contractError);
          throw new Error(`Error creating staff contract: ${contractError.message}`);
        }
      }
    }

    // Update staff pay info
    if (staffData.payInfo) {
      if (staffData.payInfo.id) {
        // Update existing pay info
        const { error: payInfoError } = await supabase
          .from("nd_staff_pay_info")
          .update({
            bank_id: staffData.payInfo.bank_id,
            bank_acc_no: staffData.payInfo.bank_acc_no,
            epf_no: staffData.payInfo.epf_no,
            socso_no: staffData.payInfo.socso_no,
            tax_no: staffData.payInfo.tax_no,
            ...updateMetaData
          })
          .eq("id", staffData.payInfo.id);

        if (payInfoError) {
          console.error("Error updating pay info:", payInfoError);
          throw new Error(`Error updating pay info: ${payInfoError.message}`);
        }
      } else {
        // Create new pay info if it doesn't exist
        const { error: payInfoError } = await supabase
          .from("nd_staff_pay_info")
          .insert({
            staff_id: staffId,
            bank_id: staffData.payInfo.bank_id,
            bank_acc_no: staffData.payInfo.bank_acc_no,
            epf_no: staffData.payInfo.epf_no,
            socso_no: staffData.payInfo.socso_no,
            tax_no: staffData.payInfo.tax_no,
            created_by: currentUser.id,
            created_at: timestamp,
            ...updateMetaData
          });

        if (payInfoError) {
          console.error("Error creating pay info:", payInfoError);
          throw new Error(`Error creating pay info: ${payInfoError.message}`);
        }
      }
    }

    return { success: true, message: "Staff details updated successfully" };
  } catch (error) {
    console.error("Error updating staff member:", error);
    throw error;
  }
}

export async function getStaffDetails(staffId: string) {
  try {
    // Fetch staff profile
    const { data: staffProfile, error: staffProfileError } = await supabase
      .from("nd_staff_profile")
      .select("*")
      .eq("id", staffId)
      .single();

    if (staffProfileError) {
      throw new Error(`Error fetching staff profile: ${staffProfileError.message}`);
    }

    // Fetch staff address
    const { data: staffAddress, error: staffAddressError } = await supabase
      .from("nd_staff_address")
      .select("*")
      .eq("staff_id", staffId)
      .eq("is_active", true)
      .single();

    // Fetch staff contact
    const { data: staffContact, error: staffContactError } = await supabase
      .from("nd_staff_contact")
      .select("*")
      .eq("staff_id", staffId)
      .single();

    // Fetch staff contract
    const { data: staffContract, error: staffContractError } = await supabase
      .from("nd_staff_contract")
      .select("*")
      .eq("staff_id", staffId)
      .eq("is_active", true)
      .single();

    // Fetch staff pay info
    const { data: staffPayInfo, error: staffPayInfoError } = await supabase
      .from("nd_staff_pay_info")
      .select("*")
      .eq("staff_id", staffId)
      .single();

    // Fetch staff job
    const { data: staffJob, error: staffJobError } = await supabase
      .from("nd_staff_job")
      .select("*")
      .eq("staff_id", staffId)
      .eq("is_active", true)
      .single();

    return {
      profile: staffProfile || null,
      address: staffAddress || null,
      contact: staffContact || null,
      contract: staffContract || null,
      payInfo: staffPayInfo || null,
      job: staffJob || null
    };
  } catch (error) {
    console.error("Error fetching staff details:", error);
    throw error;
  }
}
