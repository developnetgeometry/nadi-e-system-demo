
import { Card } from "@/components/ui/card";
// import { PageContainer } from "@/components/ui/dashboard/PageContainer";
import { PageHeader } from "@/components/ui/dashboard/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StatusCard from "@/components/ui/dashboard/StatusCard";
import { Calendar, Clock, UserCircle, Wrench } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Technician() {
  const technicians = [
    { id: 1, name: "John Doe", specialty: "Electrical", activeJobs: 3, completedToday: 2, availableIn: null },
    { id: 2, name: "Sarah Smith", specialty: "Plumbing", activeJobs: 1, completedToday: 4, availableIn: 30 },
    { id: 3, name: "Michael Brown", specialty: "HVAC", activeJobs: 2, completedToday: 1, availableIn: 15 },
    { id: 4, name: "Lisa Johnson", specialty: "Mechanical", activeJobs: 0, completedToday: 3, availableIn: null },
    { id: 5, name: "Robert Davis", specialty: "Electrical", activeJobs: 2, completedToday: 0, availableIn: 45 },
  ];

  return (
    <DashboardLayout>
    {/*<PageContainer> */}
      <PageHeader 
        title="Technician Dashboard" 
        description="Monitor technician availability and workload" 
      />
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Total Technicians"
          count={12}
          color="blue"
          icon={<UserCircle size={18} />}
        />
        <StatusCard
          title="Available Now"
          count={5}
          color="green"
          icon={<Clock size={18} />}
        />
        <StatusCard
          title="On Assignment"
          count={7}
          color="yellow"
          icon={<Wrench size={18} />}
        />
        <StatusCard
          title="Jobs Completed Today"
          count={23}
          color="purple"
          icon={<Calendar size={18} />}
        />
      </div>
      
      <div className="mt-6">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Active Jobs</TableHead>
                <TableHead>Completed Today</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.map((tech) => (
                <TableRow key={tech.id}>
                  <TableCell className="font-medium">{tech.name}</TableCell>
                  <TableCell>{tech.specialty}</TableCell>
                  <TableCell>{tech.activeJobs}</TableCell>
                  <TableCell>{tech.completedToday}</TableCell>
                  <TableCell>
                    {tech.activeJobs === 0 ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>
                    ) : tech.availableIn === null ? (
                      <Badge variant="secondary">Busy</Badge>
                    ) : (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                        Available in {tech.availableIn} min
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    {/*</PageContainer> */}
    </DashboardLayout>
  );
}
