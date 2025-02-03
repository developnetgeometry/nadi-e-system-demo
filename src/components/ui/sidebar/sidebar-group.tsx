import React from "react";

export const SidebarGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="sidebar-group">{children}</div>;
};

export const SidebarGroupLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="sidebar-group-label">{children}</div>;
};

export const SidebarGroupContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="sidebar-group-content">{children}</div>;
};