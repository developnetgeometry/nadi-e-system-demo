
import { HomeIcon as HomeIcon } from "lucide-react";

export const SiteManagementHeader = () => {
  return (
    <div className="flex items-center gap-3 mb-8">
      <HomeIcon className="h-8 w-8 text-indigo-600" />
      <h1 className="text-3xl font-bold">Site Management</h1>
    </div>
  );
};
