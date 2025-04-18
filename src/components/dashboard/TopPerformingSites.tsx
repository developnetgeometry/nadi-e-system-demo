
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopPerformingSites: React.FC = () => {
  const navigate = useNavigate();
  
  // Sample data for top performing sites
  const sites = [
    {
      id: 1,
      name: "Kuala Lumpur Central",
      siteId: "KL-001",
      revenue: "RM 125,450",
      change: "+12.3%",
      changeType: "increase"
    },
    {
      id: 2,
      name: "Penang Bay",
      siteId: "PNG-003",
      revenue: "RM 98,720",
      change: "+8.7%",
      changeType: "increase"
    },
    {
      id: 3,
      name: "Johor Central",
      siteId: "JHR-002",
      revenue: "RM 87,350",
      change: "+2.1%",
      changeType: "neutral"
    },
    {
      id: 4,
      name: "Sarawak Hub",
      siteId: "SWK-001",
      revenue: "RM 76,480",
      change: "-3.5%",
      changeType: "decrease"
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Performing Sites</CardTitle>
        <CardDescription>Sites with highest revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sites.map((site) => (
            <div key={site.id} className="flex justify-between items-center pb-2 border-b last:border-0">
              <div>
                <p className="font-medium">{site.name}</p>
                <p className="text-sm text-muted-foreground">Site ID: {site.siteId}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{site.revenue}</p>
                <Badge className={
                  site.changeType === 'increase' 
                    ? "bg-green-100 text-green-800" 
                    : site.changeType === 'decrease'
                      ? "bg-red-100 text-red-800" 
                      : "bg-amber-100 text-amber-800"
                }>
                  {site.change}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center"
          onClick={() => navigate('/admin/site-revenue')}
        >
          View All Sites
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TopPerformingSites;
