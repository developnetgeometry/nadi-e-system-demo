import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ClosureAffectArea, ClosureCategory, ClosureSession, ClosureSubCategory, SiteListClosureRequest } from "../types/site-closure";

export const fetchlListClosureData = async (): Promise<SiteListClosureRequest[]> => {
  const { data, error } = await supabase
        .from("nd_site_closure")
        .select(`
            id,
            nd_closure_categories:nd_closure_categories(
                bm,
                eng
            ),
            close_start,
            close_end,
            duration,
            nd_closure_status:nd_closure_status(
                name
            ),
            nd_site_profile:nd_site_profile(
                sitename,
                nd_site:nd_site(standard_code),
                organizations:organizations(
                    name,
                    type,
                    parent_id(name)
                )
            ),
            requester_id,
            request_datetime
        `)
        .order("created_at", { ascending: false }); 
        if (error) throw error;
        
  console.log("Raw data from API:", JSON.stringify(data?.[0], null, 2)); // Log structure of first item
  return data as unknown as SiteListClosureRequest[];
};

export const fetchClosureCategories = async (): Promise<ClosureCategory[]> => {
  const { data, error } = await supabase.from("nd_closure_categories").select("id,bm,eng");
  if (error) throw error;
  return data || [];
};

export const fetchClosureSubCategories = async (): Promise<ClosureSubCategory[]> => {
  const { data, error } = await supabase.from("nd_closure_subcategories").select(`id, bm, eng, nd_closure_categories(id)`);
  if (error) throw error;
  return data || [];
};

export const fetchClosureAffectAreas = async (): Promise<ClosureAffectArea[]> => {
  const { data, error } = await supabase.from("nd_closure_affect_areas").select("id, bm, eng");
  if (error) throw error;
  return data || [];
};

export const fetchClosureSession = async (): Promise<ClosureSession[]> => {
  const { data, error } = await supabase.from("nd_closure_session").select("id, bm, eng");
  if (error) throw error;
  return data || [];
};

export const fetchClosureDetail = async (closureId: number | string): Promise<any> => {
  const { data, error } = await supabase
    .from("nd_site_closure")
    .select(`
      id,
      remark,
      nd_closure_categories:nd_closure_categories(
          id,
          bm,
          eng
      ),
      nd_closure_subcategories:nd_closure_subcategories(
          id,
          bm,
          eng
      ),
      close_start,
      close_end,
      start_time,
      end_time,
      session,
      nd_closure_session:nd_closure_session(
          id,
          bm,
          eng
      ),
      duration,
      nd_closure_status:nd_closure_status(
          id,
          name
      ),
      nd_site_profile:nd_site_profile(
          id,
          sitename,
          nd_site:nd_site(standard_code),
          organizations:organizations(
              id,
              name,
              type,
              parent_id(id, name)
          )
      ),
      requester_id,
      request_datetime,
      nd_site_closure_affect_area:nd_site_closure_affect_area(
          id,
          site_affect_area,
          nd_closure_affect_areas:nd_closure_affect_areas(
              id,
              bm,
              eng
          )
      ),
      nd_site_closure_attachment:nd_site_closure_attachment(
          id,
          file_path
      )
    `)
    .eq("id", closureId)
    .single();
  
  if (error) throw error;
  return data;
};