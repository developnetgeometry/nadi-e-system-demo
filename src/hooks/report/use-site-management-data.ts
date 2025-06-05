import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useFormatDuration } from "@/hooks/use-format-duration";

export interface SiteData {
  id: string;
  sitename: string;
  standard_code?: string;
  fullname?: string;
  is_active: boolean;
  phase_id?: string;
  phase_name?: string;
  dusp_id?: string | null;
  dusp_name?: string;
  hasDusp: boolean;
}

export interface UtilityData {
  id: string;
  site_id: string;
  sitename?: string;
  year: number;
  month: number;
  type_id: number;
  type_name: string;
  reference_no?: string;
  amount_bill: number;
  remark?: string;
  file_path?: string;
  payment_date?: string;
}

export interface SiteInsuranceData {
  id: number;
  site_id: string;
  sitename?: string;
  insurance_type_id: number;
  insurance_type_name: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  duration?: string; // Formatted duration string
  attachments?: string[]; // URLs to attachments
}

export interface SiteAuditData {
  id: string;
  site_id: string;
  sitename?: string;
}

export interface SiteAgreementData {
  id: string;
  site_id: string;
  sitename?: string;
}

export interface LocalAuthorityData {
  id: string;
  site_id: string;
  sitename?: string;
}

export interface AwarenessPromotionData {
  id: string;
  site_id: string;
  sitename?: string;
  programme_name?: string;
  date?: string;
  status?: string;
}

export const useSiteManagementData = (
  duspFilter: (string | number)[],
  phaseFilter: string | number | null,
  nadiFilter: (string | number)[],
  monthFilter: string | number | null,
  yearFilter: string | number | null,
  tpFilter: (string | number)[] = []
) => {
  const [sites, setSites] = useState<SiteData[]>([]);
  const [utilities, setUtilities] = useState<UtilityData[]>([]);
  const [insurance, setInsurance] = useState<SiteInsuranceData[]>([]);
  const [audits, setAudits] = useState<SiteAuditData[]>([]);
  const [agreements, setAgreements] = useState<SiteAgreementData[]>([]);
  const [localAuthority, setLocalAuthority] = useState<LocalAuthorityData[]>([]);
  const [awarenessPromotion, setAwarenessPromotion] = useState<AwarenessPromotionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
    setError(null);
    setSites([]);
    setUtilities([]);
    setInsurance([]);
    setAudits([]);
    setAgreements([]);
    setLocalAuthority([]);
    setAwarenessPromotion([]);
  }, [duspFilter, phaseFilter, nadiFilter, monthFilter, yearFilter, tpFilter]);

  return {
    sites,
    utilities,
    insurance,
    localAuthority,
    audits,
    agreements,
    awarenessPromotion,
    loading,
    error
  };
};
