export interface MockProgramme {
  id: string;
  title: string;
  location: string;
  date: string;
  createdBy: string;
  status: "registered" | "active" | "completed" | "cancelled" | "draft";
}

export const mockProgrammes: MockProgramme[] = [
  {
    id: "1",
    title: "Digital Marketing for SMEs",
    location: "Johor Bahru Business Hub",
    date: "2025-08-17",
    createdBy: "Raj Kumar",
    status: "registered",
  },
  {
    id: "2",
    title: "Financial Technology Workshop",
    location: "Melaka Financial Center",
    date: "2025-05-04",
    createdBy: "Siti Norhaliza",
    status: "cancelled",
  },
  {
    id: "3",
    title: "Entrepreneurship Bootcamp",
    location: "Kuala Lumpur Convention Center",
    date: "2025-09-22",
    createdBy: "Ahmad Abdullah",
    status: "active",
  },
  {
    id: "4",
    title: "E-Commerce Success Strategies",
    location: "Penang Digital Hub",
    date: "2025-07-10",
    createdBy: "Lee Wei Ming",
    status: "draft",
  },
  {
    id: "5",
    title: "Social Media Management",
    location: "Ipoh Community Center",
    date: "2025-06-15",
    createdBy: "Sarah Tan",
    status: "completed",
  },
];
