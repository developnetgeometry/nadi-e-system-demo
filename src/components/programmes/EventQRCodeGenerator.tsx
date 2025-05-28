import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EventQRCodeGeneratorProps {
  eventId: string;
  eventTitle: string;
}

export const EventQRCodeGenerator: React.FC<EventQRCodeGeneratorProps> = ({
  eventId,
  eventTitle,
}) => {
  const [registrationUrl, setRegistrationUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Generate the registration URL
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/event-registration/${eventId}`;
    setRegistrationUrl(url);
  }, [eventId]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(registrationUrl);
      toast({
        title: "Copied!",
        description: "Registration URL copied to clipboard",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById(`qr-code-${eventId}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = `event-${eventId}-qr-code.png`;
      link.href = canvas.toDataURL();
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const openRegistrationPage = () => {
    window.open(registrationUrl, "_blank");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Event QR Code</CardTitle>
        <p className="text-sm text-muted-foreground">{eventTitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <QRCodeSVG
            id={`qr-code-${eventId}`}
            value={registrationUrl}
            size={200}
            level="M"
            includeMargin={true}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Registration URL:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={registrationUrl}
              readOnly
              className="flex-1 p-2 text-xs border rounded bg-gray-50"
            />
            <Button size="sm" variant="outline" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={downloadQRCode} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download QR
          </Button>
          <Button
            variant="outline"
            onClick={openRegistrationPage}
            className="flex-1"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
