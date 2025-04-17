import LastLogin from "./LastLogin";

export const ProfileHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <LastLogin />
    </div>
  );
};