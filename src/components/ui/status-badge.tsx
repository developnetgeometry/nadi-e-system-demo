
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  let badgeClass = '';
  
  switch (status) {
    case 'Active':
      badgeClass = 'bg-green-100 text-green-800 hover:bg-green-200';
      break;
    case 'In Progress':
      badgeClass = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      break;
    case 'Closed':
      badgeClass = 'bg-red-100 text-red-800 hover:bg-red-200';
      break;
    case 'present':
      badgeClass = 'bg-green-100 text-green-800 hover:bg-green-200';
      break;
    case 'absent':
      badgeClass = 'bg-red-100 text-red-800 hover:bg-red-200';
      break;
    case 'pending':
      badgeClass = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      break;
    case 'on leave':
      badgeClass = 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      break;
    case 'late':
      badgeClass = 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }

  return (
    <Badge variant="outline" className={cn(`text-xs font-normal ${badgeClass}`, className)}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
