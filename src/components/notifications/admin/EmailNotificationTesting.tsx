import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send } from "lucide-react";
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

export const EmailNotificationTesting = () => {
  const { toast } = useToast();
  const { sendTestEmailNotification, isLoading } = useNotifications();
  const [formData, setFormData] = useState({
    email: "",
    subject: "Test Email Notification",
    message: "This is a test email from the notification system.",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email address is required",
      });
      return;
    }

    const success = await sendTestEmailNotification(
      formData.email,
      formData.subject,
      formData.message
    );

    if (success) {
      // Reset the form or leave as is based on UX preference
      // setFormData({
      //   ...formData,
      //   message: "This is a test email from the notification system.",
      // });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Email Notifications</CardTitle>
        <CardDescription>
          Send test emails to verify your email notification setup
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Recipient Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the email address of the user who should receive the test
              email
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Email Message</Label>
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
                Send Test Email
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6 flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>
            Email testing helps ensure notifications are being delivered
            properly
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};
