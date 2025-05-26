import { RouteObject } from "react-router-dom";
import VendorManagement from "@/pages/dashboard/vendor/VendorManagement";
import VendorCompanies from "@/pages/dashboard/vendor/VendorCompanies";
import VendorStaff from "@/pages/dashboard/vendor/VendorStaff";
import VendorRegistration from "@/pages/dashboard/vendor/VendorRegistration";
import VendorStaffRegistration from "@/pages/dashboard/vendor/VendorStaffRegistration";

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
];
