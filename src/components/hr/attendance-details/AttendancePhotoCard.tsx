
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";

interface AttendancePhotoCardProps {
  photoPath: string;
}

export const AttendancePhotoCard: React.FC<AttendancePhotoCardProps> = ({ photoPath }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Camera className="h-5 w-5 text-blue-600" />
          Attendance Photo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <img
            src={photoPath}
            alt="Attendance Photo"
            className="max-w-full max-h-96 rounded-lg border shadow-sm"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwTDEwMCAxMDBaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIxMDAiIHk9IjEwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIj5QaG90byBub3QgYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K';
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
