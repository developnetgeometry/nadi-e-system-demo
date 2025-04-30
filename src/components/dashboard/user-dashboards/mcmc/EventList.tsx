import React from "react";
import { Calendar } from "lucide-react";

interface EventItemProps {
  title: string;
  location: string;
  date: string;
}

const EventItem = ({ title, location, date }: EventItemProps) => {
  return (
    <div className="event-item">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
          <Calendar size={20} />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-white">{title}</h4>
        {date && <p className="text-xs text-gray-400 mt-1">{date}</p>}
        {location && <p className="text-xs text-gray-400">{location}</p>}
      </div>
    </div>
  );
};

interface EventListProps {
  events: EventItemProps[];
}

const EventList = ({ events }: EventListProps) => {
  return (
    <div className="card-dashboard animate-fade-in">
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Event at NADI</h3>
          <button className="text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div>
        {events.map((event, index) => (
          <EventItem key={index} {...event} />
        ))}
      </div>
    </div>
  );
};

export default EventList;
