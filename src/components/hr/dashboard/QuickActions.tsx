import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserPlus,
  Computer,
  CheckCircle,
  CalendarPlus,
  MapPin,
  BarChart3,
  Send,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

const QuickActions = () => {
  const buttonStyles = {
    member: "hover:bg-purple-100 hover:border-purple-300 hover:text-purple-700",
    booking: "hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700",
    checkin: "hover:bg-green-100 hover:border-green-300 hover:text-green-700",
    event: "hover:bg-orange-100 hover:border-orange-300 hover:text-orange-700",
    facility: "hover:bg-teal-100 hover:border-teal-300 hover:text-teal-700",
    report: "hover:bg-indigo-100 hover:border-indigo-300 hover:text-indigo-700",
    message: "hover:bg-pink-100 hover:border-pink-300 hover:text-pink-700",
    more: "hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700",
  };

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="border-b bg-white/50 backdrop-blur-sm">
        {/* Increased text size and adjusted font weight */}
        <CardTitle className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/member-profile"
            className="transform transition-transform hover:scale-105"
          >
            <Button
              variant="outline"
              className={`w-full h-full py-6 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${buttonStyles.member}`}
            >
              <UserPlus className="h-6 w-6" />
              <span>Add Member</span>
            </Button>
          </Link>

          <Link
            to="/bookings"
            className="transform transition-transform hover:scale-105"
          >
            <Button
              variant="outline"
              className={`w-full h-full py-6 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${buttonStyles.booking}`}
            >
              <Computer className="h-6 w-6" />
              <span>New PC Booking</span>
            </Button>
          </Link>

          <Link
            to="/check-in"
            className="transform transition-transform hover:scale-105"
          >
            <Button
              variant="outline"
              className={`w-full h-full py-6 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${buttonStyles.checkin}`}
            >
              <CheckCircle className="h-6 w-6" />
              <span>Check-in Member</span>
            </Button>
          </Link>

          <Link
            to="/events"
            className="transform transition-transform hover:scale-105"
          >
            <Button
              variant="outline"
              className={`w-full h-full py-6 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${buttonStyles.event}`}
            >
              <CalendarPlus className="h-6 w-6" />
              <span>Create Event</span>
            </Button>
          </Link>

          <Link
            to="/bookings"
            className="transform transition-transform hover:scale-105"
          >
            <Button
              variant="outline"
              className={`w-full h-full py-6 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${buttonStyles.facility}`}
            >
              <MapPin className="h-6 w-6" />
              <span>Book Facility</span>
            </Button>
          </Link>

          <Link
            to="/reports"
            className="transform transition-transform hover:scale-105"
          >
            <Button
              variant="outline"
              className={`w-full h-full py-6 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${buttonStyles.report}`}
            >
              <BarChart3 className="h-6 w-6" />
              <span>Run Reports</span>
            </Button>
          </Link>

          <Link
            to="/communications"
            className="transform transition-transform hover:scale-105"
          >
            <Button
              variant="outline"
              className={`w-full h-full py-6 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${buttonStyles.message}`}
            >
              <Send className="h-6 w-6" />
              <span>Send Message</span>
            </Button>
          </Link>

          <Link
            to="/settings"
            className="transform transition-transform hover:scale-105"
          >
            <Button
              variant="outline"
              className={`w-full h-full py-6 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${buttonStyles.more}`}
            >
              <Plus className="h-6 w-6" />
              <span>More Actions</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
