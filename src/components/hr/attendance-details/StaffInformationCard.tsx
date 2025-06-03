
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { AttendanceRecord } from "@/lib/attendance";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";

interface StaffInformationCardProps {
  record: AttendanceRecord;
}

export const StaffInformationCard: React.FC<StaffInformationCardProps> = ({ record }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Staff Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Full Name</p>
          <p className="text-base">{record.nd_staff_profile?.fullname || 'Unknown'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">IC Number</p>
          <p className="text-base">{record.nd_staff_profile?.ic_no || 'Not provided'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Mobile Number</p>
          <p className="text-base">{record.nd_staff_profile?.mobile_no || 'Not provided'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Site</p>
          <p className="text-base">{record.nd_site_profile?.sitename || 'Unknown'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Date</p>
          <p className="text-base">{format(new Date(record.attend_date), 'dd MMMM yyyy')}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Attendance Type</p>
          <div className="mt-1">
            <AttendanceStatusBadge record={record} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
