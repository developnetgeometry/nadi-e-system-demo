import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

const lineChartData = [
  { name: 'Jan', users: 400, activities: 240 },
  { name: 'Feb', users: 300, activities: 139 },
  { name: 'Mar', users: 200, activities: 980 },
  { name: 'Apr', users: 278, activities: 390 },
  { name: 'May', users: 189, activities: 480 },
  { name: 'Jun', users: 239, activities: 380 },
];

const barChartData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
];

const donutData = [
  { name: 'Active', value: 400 },
  { name: 'Inactive', value: 300 },
  { name: 'Pending', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export const DashboardCharts = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 mt-8">
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#8884d8" />
              <Line type="monotone" dataKey="activities" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Daily Activity</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">System Status</span>
              <span className="text-sm font-medium text-green-500">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Last Backup</span>
              <span className="text-sm font-medium">Today, 03:00 AM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Server Load</span>
              <span className="text-sm font-medium">23%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};