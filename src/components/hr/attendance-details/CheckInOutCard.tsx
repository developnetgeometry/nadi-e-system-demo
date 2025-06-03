
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

interface CheckInOutCardProps {
  title: string;
  time: string | null;
  longitude: number | null;
  latitude: number | null;
  address: string | null;
  iconColor: string;
}

export const CheckInOutCard: React.FC<CheckInOutCardProps> = ({
  title,
  time,
  longitude,
  latitude,
  address,
  iconColor
}) => {
  const formatTime = (time: string | null) => {
    if (!time) return 'Not recorded';
    return format(new Date(`2000-01-01T${time}`), 'HH:mm:ss');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className={`h-5 w-5 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Time</p>
          <p className="text-base font-mono">{formatTime(time)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Longitude</p>
          <p className="text-base font-mono">{longitude !== null ? longitude.toFixed(6) : 'Not recorded'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Latitude</p>
          <p className="text-base font-mono">{latitude !== null ? latitude.toFixed(6) : 'Not recorded'}</p>
        </div>
        {address && (
          <div className="md:col-span-2 lg:col-span-3">
            <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Address
            </p>
            <p className="text-base">{address}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
