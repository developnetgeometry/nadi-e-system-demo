import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteProfile } from "./hook/use-site-profile";
import {
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableHeader,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Settings, Trash2, MapPin, Globe, Mail, Calendar, Users, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "../layout/DashboardLayout";

const SiteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useSiteProfile(id);

  if (loading) return <Skeleton className="w-full h-96">Loading...</Skeleton>;
  if (error) return <div className="p-4 text-destructive">Error: {error}</div>;

  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;
    
    const statusMap = {
      true: { variant: "success", label: "Active" },
      false: { variant: "destructive", label: "Inactive" },
    };
    
    const { variant, label } = statusMap[status] || { variant: "outline", label: status.toString() };
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
     <DashboardLayout>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{data.sitename || data.fullname || "Site Details"}</h1>
        {/* <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Location Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Region:</span>
              <span className="font-medium">{data.region_id || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">State:</span>
              <span className="font-medium">{data.state_id || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mukim:</span>
              <span className="font-medium">{data.mukim_id || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Coordinates:</span>
              <span className="font-medium">
                {data.latitude && data.longtitude 
                  ? `${data.latitude}, ${data.longtitude}` 
                  : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Contact & Online Presence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{data.email || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Website:</span>
              <span className="font-medium">{data.website || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference ID:</span>
              <span className="font-medium">{data.ref_id || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span>{getStatusBadge(data.is_active)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Building Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Building Type:</span>
              <span className="font-medium">{data.building_type_id || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Building Area:</span>
              <span className="font-medium">{data.building_area_id || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rental:</span>
              <span className="font-medium">{data.building_rental_id ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">OKU Friendly:</span>
              <span className="font-medium">{data.oku_friendly ? "Yes" : "No"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Demographic & Technical Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Technology</TableHead>
                  <TableHead>Bandwidth</TableHead>
                  <TableHead>Total Population</TableHead>
                  <TableHead>Socioeconomic ID</TableHead>
                  <TableHead>Phase ID</TableHead>
                  <TableHead>Cluster ID</TableHead>
                  <TableHead>Operation Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{data.technology || "N/A"}</TableCell>
                  <TableCell>{data.bandwidth ? `${data.bandwidth} Mbps` : "N/A"}</TableCell>
                  <TableCell>{data.total_population?.toLocaleString() || "N/A"}</TableCell>
                  <TableCell>{data.socioeconomic_id || "N/A"}</TableCell>
                  <TableCell>{data.phase_id || "N/A"}</TableCell>
                  <TableCell>{data.cluster_id || "N/A"}</TableCell>
                  <TableCell>
                    {data.operate_date 
                      ? new Date(data.operate_date).toLocaleDateString() 
                      : "Not specified"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableBody>
                <TableRow>
                  <TableHead className="w-1/4">Parliament RFID</TableHead>
                  <TableCell>{data.parliament_rfid || "N/A"}</TableCell>
                  <TableHead className="w-1/4">DUN RFID</TableHead>
                  <TableCell>{data.dun_rfid || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>UST ID</TableHead>
                  <TableCell>{data.ust_id || "N/A"}</TableCell>
                  <TableHead>DUSP TP ID</TableHead>
                  <TableCell>{data.dusp_tp_id || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Space ID</TableHead>
                  <TableCell>{data.space_id || "N/A"}</TableCell>
                  <TableHead>Zone ID</TableHead>
                  <TableCell>{data.zone_id || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Area ID</TableHead>
                  <TableCell>{data.area_id || "N/A"}</TableCell>
                  <TableHead>Level ID</TableHead>
                  <TableCell>{data.level_id || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Created At</TableHead>
                  <TableCell>
                    {data.created_at 
                      ? new Date(data.created_at).toLocaleString() 
                      : "N/A"}
                  </TableCell>
                  <TableHead>Updated At</TableHead>
                  <TableCell>
                    {data.updated_at 
                      ? new Date(data.updated_at).toLocaleString() 
                      : "N/A"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {data.remark && (
        <Card>
          <CardHeader>
            <CardTitle>Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{data.remark}</p>
          </CardContent>
        </Card>
      )}
    </div>
    </DashboardLayout>
  );
};

export default SiteDetail;
