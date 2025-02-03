import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ServiceData {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
}

export const useServiceData = () => {
  console.log("Fetching service data...");
  
  return useQuery({
    queryKey: ["services"],
    queryFn: async (): Promise<ServiceData[]> => {
      // For now returning mock data since we haven't set up the services table yet
      // This would normally fetch from Supabase
      return [
        {
          id: "1",
          name: "Basic Membership",
          description: "Access to basic facilities and services",
          price: "RM 50/month",
          features: ["Gym access", "Basic classes", "Locker usage"],
        },
        {
          id: "2", 
          name: "Premium Membership",
          description: "Full access to all facilities and premium services",
          price: "RM 100/month",
          features: ["All basic features", "Premium classes", "Personal trainer", "Spa access"],
        },
      ];
    },
  });
};