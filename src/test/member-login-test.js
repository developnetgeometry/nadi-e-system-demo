/**
 * Test file for member login using identification number
 * 
 * To use this test:
 * 1. Have a member account in your system with a known IC number and password
 * 2. Replace the TEST_IC_NUMBER and TEST_PASSWORD values below
 * 3. Run this test manually when needed
 */

const TEST_IC_NUMBER = "012345678901"; // Replace with a real IC number for testing
const TEST_PASSWORD = "password123";    // Replace with the member's password

async function testMemberLogin() {
    try {
        const { supabase } = await import("../integrations/supabase/client");

        // Step 1: Find the member by IC number
        console.log("Looking for member with IC:", TEST_IC_NUMBER);

        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("id, email, full_name")
            .eq("ic_number", TEST_IC_NUMBER)
            .eq("user_type", "member")
            .single();

        if (profileError) {
            console.error("❌ Profile fetch error:", profileError);
            return;
        }

        console.log("✅ Found member:", profileData.full_name, "with email:", profileData.email);

        // Step 2: Sign in with the email and password
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: profileData.email,
            password: TEST_PASSWORD,
        });

        if (authError) {
            console.error("❌ Authentication error:", authError);
            return;
        }

        console.log("✅ Successfully authenticated user with IC number");
        console.log("User ID:", authData.user.id);
        console.log("Email:", authData.user.email);

    } catch (error) {
        console.error("❌ Test failed:", error.message);
    }
}

// Only run this test manually when needed
// testMemberLogin();

export default testMemberLogin;
