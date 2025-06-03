
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Building, Briefcase } from "lucide-react";
import { AttendanceRecord } from "@/lib/attendance";

interface AttendanceStatusBadgeProps {
  record: AttendanceRecord;
}

export const AttendanceStatusBadge: React.FC<AttendanceStatusBadgeProps> = ({ record }) => {
  const getStatusBadge = () => {
    if (record.check_in && record.check_out) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Present</Badge>;
    } else if (record.check_in && !record.check_out) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Checked In</Badge>;
    } else {
      return <Badge variant="destructive">Absent</Badge>;
    }
  };

  const getAttendanceTypeBadge = (type: number) => {
    switch (type) {
      case 1:
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <Building className="h-3 w-3 mr-1" />
            On Site
          </Badge>
        );
      case 2:
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Briefcase className="h-3 w-3 mr-1" />
            Outstation
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span>Attendance Details</span>
      {getStatusBadge()}
      {getAttendanceTypeBadge(record.attendance_type)}
    </div>
  );
};
