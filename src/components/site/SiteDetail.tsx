import { Eye, EyeOff, Users, UserCheck, UserCog, DollarSign } from "lucide-react";
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
import {
  Settings,
  Trash2,
  MapPin,
  Globe,
  Mail,
  Calendar,
  Users,
  Building,
  EyeOff,
  Eye,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSiteGeneralData from "@/hooks/use-site-general-data";
import useGeoData from "@/hooks/use-geo-data";
import BillingFormDialog from "./BillingFormDialog";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { useSiteBilling } from "./hook/use-site-billing";
import { supabase } from "@/lib/supabase";
import { BUCKET_NAME_UTILITIES } from "@/integrations/supabase/client";

interface SiteDetailProps {
  siteId: string;
}

const SiteDetail: React.FC<SiteDetailProps> = ({ siteId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBillingData, setSelectedBillingData] = useState(null);
  const [refreshBilling, setRefreshBilling] = useState(false); // Add this state

  const { data, loading, error } = useSiteProfile(siteId);
  const {
    siteCode,
    loading: codeLoading,
    error: codeError,
  } = useSiteCode(siteId);
  const {
    data: addressData,
    loading: addressLoading,
    error: addressError,
  } = useSiteAddress(siteId);
  const {
    data: billingData,
    loading: billingLoading,
    error: billingError,
  } = useSiteBilling(siteId, refreshBilling); // Pass refreshBilling state
  const {
    siteStatus,
    technology,
    bandwidth,
    buildingType,
    space,
    zone,
    categoryArea,
    buildingLevel,
    socioEconomics,
  } = useSiteGeneralData();
  const { regions, states, parliaments, duns, mukims, phases } = useGeoData();
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const filteredBillingData = billingData.filter((item) => {
    return (
      (yearFilter ? item.year === parseInt(yearFilter) : true) &&
      (monthFilter ? item.month === parseInt(monthFilter) : true) &&
      (typeFilter ? item.type_name === typeFilter : true)
    );
  });
  useEffect(() => {
    if (!isDialogOpen) {
      setRefreshBilling((prev) => !prev); // Toggle refreshBilling state to trigger re-fetch
    }
  }, [isDialogOpen]);

  // Function to handle delete a record
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (!confirmDelete) return;
  
    try {
      const { data: attachmentData, error: attachmentError } = await supabase
        .from("nd_utilities_attachment") // Replace with your actual table name
        .select("file_path")
        .eq("utilities_id", id) // Assuming `utilities_id` links the file to the record
        .single();
  
      if (attachmentError) {
        console.warn("No associated file found or error fetching file path:", attachmentError);
        // Proceed with record deletion even if the file path is not found
      } else if (attachmentData?.file_path) {
        const filePath = attachmentData.file_path;
  
        // Extract the part of the file path after "//"
        const relativeFilePath = filePath.split("//")[2];
  
        console.log("File path translated:", relativeFilePath);
  
        // Delete the file from storage
        const { error: storageError } = await supabase.storage
          .from(BUCKET_NAME_UTILITIES) // Replace with your storage bucket name
          .remove([relativeFilePath]);
  
        if (storageError) {
          console.error("Error deleting file from storage:", storageError);
          alert("Failed to delete the associated file. Please try again.");
          return;
        }
      }
  
      // Proceed with record deletion
      const { error } = await supabase
        .from("nd_utilities")
        .delete()
        .eq("id", id);
  
      if (error) {
        console.error("Error deleting record:", error);
        alert("An error occurred while deleting the record.");
        return;
      }
  
      alert("Record and associated file deleted successfully.");
      setRefreshBilling((prev) => !prev); // Toggle refreshBilling state to trigger re-fetch
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  if (loading || codeLoading) {
    return <Skeleton className="w-full h-24">Loading...</Skeleton>;
  }

  if (error || codeError) {
    return (
      <div className="p-4 text-destructive">
        Error: {error || codeError}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Section: Fullname, Site Code, Status */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{data.fullname || "Site Name"}</h1>
          <h3 className="text-muted-foreground">
            Site Code: <span className="font-bold">{siteCode || "N/A"}</span>
          </h3>
          <div className="font-medium flex items-center gap-2">
            <span className="text-muted-foreground">Status: </span>
            <span className="font-medium flex items-center gap-2">
              {siteStatus.find((status) => status.id === data.active_status)?.eng || "N/A"}
              {data.is_active ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </span>
          </div>
        </div>
        {parsedMetadata?.user_type?.startsWith("staff") && (
          <Button
            onClick={() => {
              setSelectedBillingData(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Billing
          </Button>
        )}
      </div>

      {/* Stats Cards Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
            iconTextColor={stat.iconTextColor}
          />
        ))}
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="border-b dark:border-gray-700 w-full justify-start bg-transparent p-0 h-auto overflow-x-auto mb-6">
          <TabsTrigger value="overview" className="px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Overview</TabsTrigger>
          {/* <TabsTrigger value="staff" className="px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Staff</TabsTrigger> */}
          <TabsTrigger value="billing" className="px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="h-full mt-0">
          <Card className="h-full">
            <div className="p-6 h-full">
              <OverviewPage site={data} socioeconomics={socioeconomics} space={space} />
            </div>
          </Card>
        </TabsContent>
        {/* <TabsContent value="staff" className="h-full mt-0">
          <Card className="h-full">
            <div className="p-6 h-full">
              <StaffPage />
            </div>
          </Card>
        </TabsContent> */}
        <TabsContent value="billing" className="h-full mt-0">
          <Card className="h-full">
            <div className="p-6 h-full">
            <BillingPage siteId={siteId} />
            </div>
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
      )}

      {activeTab === "billing" && (
        <div>
          <div className="space-y-6">
            <div className="flex space-x-4">
              <input
                type="number"
                placeholder="Year"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <input
                type="number"
                placeholder="Month"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <input
                type="text"
                placeholder="Utility Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Billing Type</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBillingData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.year}</TableCell>
                    <TableCell>{item.month}</TableCell>
                    <TableCell>{item.type_name}</TableCell>
                    <TableCell>
                      {item.file_path ? (
                        <a
                          href={item.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View PDF
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedBillingData(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Render the BillingFormDialog independently */}
      <BillingFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        siteId={siteId}
        initialData={selectedBillingData}
      />
    </div>
  );
};

export default SiteDetail;