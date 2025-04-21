import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ClosureAffectArea, ClosureCategory, ClosureSubCategory } from "../types/site-closure";


export const fetchClosureData = async (): Promise<ClosureCategory[]> => {
  const { data, error } = await supabase.from("nd_closure_categories").select("id,bm,eng");
  if (error) throw error;
  return data || [];
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