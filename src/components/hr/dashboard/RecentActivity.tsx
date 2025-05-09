import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Computer, UserRound, Calendar } from "lucide-react";

const activities = [
  {
    id: 1,
    icon: UserRound,
    description: "New member registration: Sarah Johnson",
    timestamp: "10 minutes ago",
    type: "member",
  },
  {
    id: 2,
    icon: Computer,
    description: "PC-03 booked by Ahmed Hassan",
    timestamp: "25 minutes ago",
    type: "booking",
  },
  {
    id: 3,
    icon: Calendar,
    description: "Event 'Digital Literacy Workshop' created",
    timestamp: "1 hour ago",
    type: "event",
  },
  {
    id: 4,
    icon: Computer,
    description: "PC-05 booking by Maria Garcia completed",
    timestamp: "2 hours ago",
    type: "booking",
  },
  {
    id: 5,
    icon: UserRound,
    description: "Member profile updated: John Smith",
    timestamp: "3 hours ago",
    type: "member",
  },
];

const getActivityBadge = (type: string) => {
  switch (type) {
    case "member":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-600 hover:bg-blue-50"
        >
          Member
        </Badge>
      );
    case "booking":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-600 hover:bg-green-50"
        >
          Booking
        </Badge>
      );
    case "event":
      return (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-600 hover:bg-purple-50"
        >
          Event
        </Badge>
      );
    default:
      return <Badge variant="outline">Activity</Badge>;
  }
};

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        {/* Make CardTitle text smaller */}
        <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="bg-muted rounded-full p-2">
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.description}</p>
                  {getActivityBadge(activity.type)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
