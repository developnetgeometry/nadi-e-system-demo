
import { Settings as SettingsIcon } from "lucide-react";

export const SettingsHeader = () => {
  return (
    <div className="flex items-center gap-3 mb-8">
      <SettingsIcon className="h-8 w-8 text-indigo-600" />
      <h1 className="text-xl font-bold">Settings</h1>
    </div>
  );
};
