
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceRecord } from "@/lib/attendance";
import { AttendanceStatusBadge } from "./attendance-details/AttendanceStatusBadge";
import { StaffInformationCard } from "./attendance-details/StaffInformationCard";
import { CheckInOutCard } from "./attendance-details/CheckInOutCard";
import { AttendancePhotoCard } from "./attendance-details/AttendancePhotoCard";

interface AttendanceDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: AttendanceRecord | null;
}

export const AttendanceDetailsModal: React.FC<AttendanceDetailsModalProps> = ({
  open,
  onOpenChange,
  record,
}) => {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <AttendanceStatusBadge record={record} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Staff Information */}
          <StaffInformationCard record={record} />

          {/* Check-in Details */}
          {record.check_in && (
            <CheckInOutCard
              title="Check-in Details"
              time={record.check_in}
              longitude={record.longtitude_check_in}
              latitude={record.latitude_check_in}
              address={record.address}
              iconColor="text-green-600"
            />
          )}

          {/* Check-in Photo */}
          {record.check_in && record.photo_path && (
            <AttendancePhotoCard photoPath={record.photo_path} />
          )}

          {/* Check-out Details */}
          {record.check_out && (
            <CheckInOutCard
              title="Check-out Details"
              time={record.check_out}
              longitude={record.longtitude_check_out}
              latitude={record.latitude_check_out}
              address={null} // No check-out address in the database
              iconColor="text-red-600"
            />
          )}

          {/* Working Hours */}
          {record.total_working_hour && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Working Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{record.total_working_hour}</p>
                  <p className="text-sm text-gray-600">Total hours worked</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Remarks */}
          {record.remark && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Remarks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">{record.remark}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
