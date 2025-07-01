import React from 'react';
import {
  Users,
  UserCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";

// Reusable StatsCard component
const StatsCard = ({ title, value, icon, bgColor, iconColor }: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  bgColor: string; 
  iconColor: string; 
}) => (
  <Card className="p-6 flex items-start justify-between">
    <div>
      <h3 className="text-l text-gray-600">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
    <div className={`${bgColor} p-3 rounded-full`}>
      <div className={`${iconColor} h-6 w-6`}>{icon}</div>
    </div>
  </Card>
);

// Main MemberStatsCards component
const MemberStatsCards = ({ stats }: { stats: { 
  totalMembers: number; 
  premiumMembers: number; 
  activeMembers: number; 
  lastRegistration: number; 
} }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <StatsCard 
      title="Total Members" 
      value={stats.totalMembers} 
      icon={<Users />} 
      bgColor="bg-blue-100" 
      iconColor="text-blue-600" 
    />
    <StatsCard 
      title="MADANI Members" 
      value={stats.premiumMembers} 
      icon={<Users />} 
      bgColor="bg-purple-100" 
      iconColor="text-purple-600" 
    />
    <StatsCard 
      title="Active Members" 
      value={stats.activeMembers} 
      icon={<UserCheck />} 
      bgColor="bg-green-100" 
      iconColor="text-green-600" 
    />
    <StatsCard 
      title="Entrepreneur Members" 
      value={stats.lastRegistration} 
      icon={<Users />} 
      bgColor="bg-amber-100" 
      iconColor="text-amber-600" 
    />
  </div>
);

export default MemberStatsCards;