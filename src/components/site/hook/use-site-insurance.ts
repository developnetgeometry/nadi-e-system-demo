import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface InsuranceData {
  id: number; // Changed to number
  description: string;
  type_id: number; // Changed to number
  type_name: string;
  insurance_type_id: number; // Changed to number
  insurance_type_name: string;
  report_detail: string;
  file_path: string;
}
export const useSiteInsurance = (siteId: string, refresh: boolean) => {
  const [data, setData] = useState<InsuranceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsuranceData = async () => {
      try {
        // Fetch site remarks
        const { data: siteRemarks, error: siteRemarksError } = await supabase
          .from("nd_site_remark")
          .select("id, description, type_id")
          .eq("site_id", Number(siteId));

        if (siteRemarksError) throw siteRemarksError;

        // Fetch incident types
        const typeIds = siteRemarks.map((remark) => remark.type_id);
        const { data: incidentTypes, error: incidentTypesError } = await supabase
          .from("nd_incident_type")
          .select("id, name")
          .in("id", typeIds);

        if (incidentTypesError) throw incidentTypesError;

        // Map type names to site remarks
        const remarksWithTypes = siteRemarks.map((remark) => ({
          ...remark,
          type_name: incidentTypes.find((type) => type.id === remark.type_id)?.name || "N/A",
        }));

        // Fetch insurance reports
        const remarkIds = siteRemarks.map((remark) => remark.id);
        const { data: insuranceReports, error: insuranceReportsError } = await supabase
          .from("nd_insurance_report")
          .select("site_remark_id, insurance_type_id, report_detail")
          .in("site_remark_id", remarkIds);

        if (insuranceReportsError) throw insuranceReportsError;

        // Fetch insurance coverage types
        const insuranceTypeIds = insuranceReports.map((report) => report.insurance_type_id);
        const { data: insuranceTypes, error: insuranceTypesError } = await supabase
          .from("nd_insurance_coverage_type")
          .select("id, name")
          .in("id", insuranceTypeIds);

        if (insuranceTypesError) throw insuranceTypesError;

        // Map insurance type names to reports
        const reportsWithTypes = insuranceReports.map((report) => ({
          ...report,
          insurance_type_name: insuranceTypes.find((type) => type.id === report.insurance_type_id)?.name || "N/A",
        }));

        // Fetch attachments
        const { data: attachments, error: attachmentsError } = await supabase
          .from("nd_site_attachment")
          .select("site_remark_id, file_path")
          .in("site_remark_id", remarkIds) as { data: { site_remark_id: number; file_path: string }[] | null, error: any };

        if (attachmentsError) throw attachmentsError;

        // Combine all data
        const insuranceData = remarksWithTypes.map((remark) => {
          const report = reportsWithTypes.find((r) => r.site_remark_id === remark.id) || {} as Partial<typeof reportsWithTypes[number]>;
          const attachment = attachments.find((a) => a.site_remark_id === remark.id) || { file_path: "" };
          return {
            id: remark.id, // Ensure id is a number
            description: remark.description,
            type_id: remark.type_id, // Ensure type_id is a number
            type_name: remark.type_name,
            insurance_type_id: report.insurance_type_id || 0, // Default to 0 if not found
            insurance_type_name: report.insurance_type_name || "N/A",
            report_detail: report.report_detail || "",
            file_path: attachment.file_path || "",
          };
        });

        setData(insuranceData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsuranceData();
  }, [siteId, refresh]);

  return { data, loading, error };
};