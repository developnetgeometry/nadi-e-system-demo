import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import SiteDetail from "@/components/site/SiteDetail";
import { SettingsLoading } from "@/components/settings/SettingsLoading";
import { useNavigate } from "react-router-dom";

const SiteDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setUserType(profile?.user_type || null);

        if (profile?.user_type?.startsWith("staff")) {
          const { data: staffContract, error: staffError } = await supabase
            .from("nd_staff_contract")
            .select("site_id")
            .eq("user_id", user.id)
            .single();

          if (staffError) throw staffError;

          if (staffContract?.site_id) {
            navigate(`/site/${staffContract.site_id}`);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (isLoading) {
    return <SettingsLoading />;
  }

  if (userType === "super_admin" || userType?.startsWith("tp")) {
    return (
      <DashboardLayout>
        <SiteDetail />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <p>User type not recognized.</p>
      </div>
    </DashboardLayout>
  );
};

export default SiteDetails;