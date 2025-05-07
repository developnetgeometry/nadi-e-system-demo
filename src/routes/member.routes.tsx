
import { RouteObject } from "react-router-dom";
import PersonalDetails from "@/pages/dashboard/members/PersonalDetails";
import Registration from "@/pages/dashboard/members/Registration";
import ActivityLogs from "@/pages/dashboard/members/ActivityLogs";
import MemberManagement from "@/pages/dashboard/members/MemberManagement";
import MemberProfilePages from "@/pages/dashboard/members/MemberProfilePages";

export const memberRoutes: RouteObject[] = [
  {
    path: "/members",
    element: <MemberManagement />,
  },
  {
    path: "/members/details",
    element: <PersonalDetails />,
  },
  {
    path: "/members/profile",
    element: <MemberProfilePages />,
  },
  {
    path: "/members/registration",
    element: <Registration />,
  },
  {
    path: "/members/activity",
    element: <ActivityLogs />,
  },
];
