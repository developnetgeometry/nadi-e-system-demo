
// Fix the typo in the fetch staff profiles code
const { data: staffProfiles, error: staffProfilesError } = await supabase
  .from('nd_staff_profile')
  .select('id, fullname, work_email, mobile_no, ic_no, is_active, user_id')
  .in('id', staffIds);
  
if (staffProfilesError) throw staffProfilesError;
