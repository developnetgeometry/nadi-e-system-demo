import { RouteObject } from "react-router-dom";
import PersonalDetails from "@/pages/dashboard/members/PersonalDetails";
import Registration from "@/pages/dashboard/members/Registration";
import ActivityLogs from "@/pages/dashboard/members/ActivityLogs";

export const memberRoutes: RouteObject[] = [
  {
    path: "/dashboard/members/details",
    element: <PersonalDetails />,
  },
  {
    path: "/dashboard/members/registration",
    element: <Registration />,
  },
  {
    path: "/dashboard/members/activity",
    element: <ActivityLogs />,
  },
];