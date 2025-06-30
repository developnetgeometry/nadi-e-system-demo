import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EventRegistrationForm } from "@/components/programmes/EventRegistrationForm";
import { Loader2 } from "lucide-react";

const EventRegistrationPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setError("Event ID not provided");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from("nd_event")
          .select(
            `
            id,
            program_name,
            description,
            location_event,
            start_datetime,
            end_datetime,
            trainer_name
          `
          )
          .eq("id", eventId)
          .single();

        if (error) throw error;

        if (!data) {
          setError("Event not found");
          return;
        }

        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{event.program_name}</h1>
            {event.description && (
              <div
                className="text-gray-600 mb-4 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            )}
            <div className="space-y-2 text-sm text-gray-500">
              {event.location_event && (
                <p>
                  <strong>Location:</strong> {event.location_event}
                </p>
              )}
              {event.start_datetime && (
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(event.start_datetime).toLocaleDateString()}
                </p>
              )}
              {event.trainer_name && (
                <p>
                  <strong>Trainer:</strong> {event.trainer_name}
                </p>
              )}
            </div>
          </div>

          <EventRegistrationForm
            eventId={eventId!}
            eventTitle={event.program_name}
            onRegistrationSuccess={() => {
              // You can add success handling here, like redirecting or showing a success message
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationPage;
