import { useState } from "react";

// Sample site data (in a real app, this would come from an API)
export const siteData = [
  { id: 1, name: "Main Center", location: "Kuala Lumpur" },
  { id: 2, name: "North Branch", location: "Penang" },
  { id: 3, name: "South Branch", location: "Johor Bahru" },
  { id: 4, name: "East Branch", location: "Kuantan" },
  { id: 5, name: "West Branch", location: "Kota Kinabalu" },
];

export type SiteInfo = {
  id: number;
  name: string;
  location: string;
};

export const useSuperAdmin = () => {
  // In a real app, this would be determined by authentication
  const [isSuperAdmin, setIsSuperAdmin] = useState(true);

  // Current selected site
  const [selectedSite, setSelectedSite] = useState<SiteInfo>(siteData[0]);

  // Available sites for the admin
  const [availableSites, setAvailableSites] = useState<SiteInfo[]>(siteData);

  // Toggle superadmin status (for demo purposes)
  const toggleSuperAdminStatus = () => {
    setIsSuperAdmin((prev) => !prev);
  };

  // Change the selected site
  const changeSite = (siteId: number) => {
    const site = availableSites.find((site) => site.id === siteId);
    if (site) {
      setSelectedSite(site);
      return true;
    }
    return false;
  };

  return {
    isSuperAdmin,
    selectedSite,
    availableSites,
    toggleSuperAdminStatus,
    changeSite,
  };
};
