import React from "react";
import useLastLogin from "@/hooks/use-last-login";

const LastLogin = () => {
  const { lastLogin, secondLastLogin, loading, error } = useLastLogin();

  if (loading) return <div>Loading last login time...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="text-sm text-gray-500">
      {secondLastLogin && (
        <div>Second Last Login: {new Date(secondLastLogin).toLocaleString()}</div>
      )}
      <div>Last Login: {lastLogin ? new Date(lastLogin).toLocaleString() : "No login data available"}</div>
    </div>
  );
};

export default LastLogin;