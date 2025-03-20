import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteProfile } from "./hook/use-site-profile";
import { useSiteCode } from "./hook/use-site-code";
import { useSiteAddress } from "./hook/use-site-address";
import {
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableHeader,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Settings, Trash2, MapPin, Globe, Mail, Calendar, Users, Building, EyeOff, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSiteGeneralData from "@/hooks/use-site-general-data";
import useGeoData from "@/hooks/use-geo-data";

const SiteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useSiteProfile(id);
  const { siteCode, loading: codeLoading, error: codeError } = useSiteCode(id);
  const { data: addressData, loading: addressLoading, error: addressError } = useSiteAddress(id);
  const { siteStatus, technology, bandwidth, buildingType, space, zone, categoryArea, buildingLevel } = useSiteGeneralData();
  const { regions, states, parliaments, duns, mukims, phases } = useGeoData();

  if (loading || codeLoading || addressLoading) return <Skeleton className="w-full h-96">Loading...</Skeleton>;
  if (error || codeError || addressError) return <div className="p-4 text-destructive">Error: {error || codeError || addressError}</div>;

  const getNameById = (id, data) => {
    const item = data.find(item => item.id === id);
    return item ? item.fullname || item.eng || item.name || item.area : "N/A";
  };

  return (
    <div className="space-y-6">
      <div className="items-center">
        <h1 className="text-2xl font-bold">{data.fullname || "Site Name"}</h1>
        <h3 className="text-muted-foreground">Site Code: <span className="text-black font-bold">{siteCode || "N/A"}</span></h3>
        <div className="font-medium flex items-center gap-2">
          <span className="text-muted-foreground">Status:  </span>
          <span className="font-medium flex items-center gap-2">
          {getNameById(data.active_status, siteStatus)}
            {data.is_active ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </span>
        </div>
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
              <span className="font-medium">{getNameById(data.region_id, regions)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">State:</span>
              <span className="font-medium">{getNameById(data.state_id, states)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mukim:</span>
              <span className="font-medium">{getNameById(data.mukim_id, mukims)}</span>
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
              <span className="font-medium">{getNameById(data.building_type_id, buildingType)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Building Area:</span>
              <span className="font-medium">{getNameById(data.building_area_id, space)}</span>
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
                  <TableCell>{getNameById(data.technology, technology)}</TableCell>
                  <TableCell>{getNameById(data.bandwidth, bandwidth)}</TableCell>
                  <TableCell>{data.total_population?.toLocaleString() || "N/A"}</TableCell>
                  <TableCell>{data.socioeconomic_id || "N/A"}</TableCell>
                  <TableCell>{getNameById(data.phase_id, phases)}</TableCell>
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
                  <TableCell>{getNameById(data.parliament_rfid, parliaments)}</TableCell>
                  <TableHead className="w-1/4">DUN RFID</TableHead>
                  <TableCell>{getNameById(data.dun_rfid, duns)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>UST ID</TableHead>
                  <TableCell>{data.ust_id || "N/A"}</TableCell>
                  <TableHead>DUSP TP ID</TableHead>
                  <TableCell>{data.dusp_tp_id || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Space ID</TableHead>
                  <TableCell>{getNameById(data.space_id, space)}</TableCell>
                  <TableHead>Zone ID</TableHead>
                  <TableCell>{getNameById(data.zone_id, zone)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Area ID</TableHead>
                  <TableCell>{getNameById(data.area_id, categoryArea)}</TableCell>
                  <TableHead>Level ID</TableHead>
                  <TableCell>{getNameById(data.level_id, buildingLevel)}</TableCell>
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

      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Street:</span>
            <span className="font-medium">{addressData.address1 || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Address 2:</span>
            <span className="font-medium">{addressData.address2 || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">City:</span>
            <span className="font-medium">{addressData.city || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Postal Code:</span>
            <span className="font-medium">{addressData.postcode || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Country:</span>
            <span className="font-medium">{getNameById(addressData.state_id, states)}</span>
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
  );
};

export default SiteDetail;