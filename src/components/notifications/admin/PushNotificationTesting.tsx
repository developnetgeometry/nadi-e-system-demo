import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Bell, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useNotifications } from "../hooks/useNotifications";

export const PushNotificationTesting = () => {
  const { toast } = useToast();
  const { sendTestPushNotification, isLoading } = useNotifications();
  const [formData, setFormData] = useState({
    userId: "",
    title: "Test Push Notification",
    message: "This is a test push notification from the admin panel.",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User ID is required",
      });
      return;
    }

    const success = await sendTestPushNotification(
      formData.userId,
      formData.title,
      formData.message
    );

    if (success) {
      // Reset the form or leave as is based on UX preference
      // setFormData({
      //   ...formData,
      //   message: "This is a test push notification from the admin panel.",
      // });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Push Notifications</CardTitle>
        <CardDescription>
          Send test push notifications to verify your push notification setup
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              name="userId"
              placeholder="User UUID"
              value={formData.userId}
              onChange={handleInputChange}
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the UUID of the user who should receive the push
              notification
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Notification Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Notification Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              "Sending..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Test Push Notification
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6 flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span>Push testing ensures notifications reach user devices</span>
        </div>
      </CardFooter>
    </Card>
  );
};
