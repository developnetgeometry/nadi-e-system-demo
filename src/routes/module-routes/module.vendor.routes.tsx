import { RouteObject } from "react-router-dom";
import VendorManagement from "@/pages/dashboard/vendor/VendorManagement";
import VendorCompanies from "@/pages/dashboard/vendor/VendorCompanies";
import VendorStaff from "@/pages/dashboard/vendor/VendorStaff";
import VendorRegistration from "@/pages/dashboard/vendor/VendorRegistration";
import VendorStaffRegistration from "@/pages/dashboard/vendor/VendorStaffRegistration";
import VendorContracts from "@/pages/dashboard/vendor/VendorContracts";
import VendorTeamManagement from "@/pages/dashboard/vendor/VendorTeamManagement";
import VendorReports from "@/pages/dashboard/vendor/VendorReports";

export const vendorRoutes: RouteObject[] = [
  {
    path: "/vendor",
    element: <VendorManagement />,
  },
  {
    path: "/vendor/companies",
    element: <VendorCompanies />,
  },
  {
    path: "/vendor/companies/new",
    element: <VendorRegistration />,
  },
  {
    path: "/vendor/staff",
    element: <VendorStaff />,
  },
  {
    path: "/vendor/staff/new",
    element: <VendorStaffRegistration />,
  },
  {
    path: "/vendor/contracts",
    element: <VendorContracts />,
  },
  {
    path: "/vendor/teams",
    element: <VendorTeamManagement />,
  },
  {
    path: "/vendor/reports",
    element: <VendorReports />,
  },
];
