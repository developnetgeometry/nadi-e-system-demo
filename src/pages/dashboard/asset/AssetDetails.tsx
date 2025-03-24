import { useAssetDetails } from "@/components/assets/hooks/useAssetDetails";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AssetDetails = () => {
  const { asset, isLoading, error, navigate } = useAssetDetails();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">Loading asset details...</div>
    );
  }

  if (error || !asset) {
    return (
      <div className="flex flex-col items-center p-8">
        <p className="text-destructive">Error loading asset details</p>
        <Button variant="outline" onClick={() => navigate("/asset")}>
          Back to Asset List
        </Button>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/asset">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">Asset Details</h1>
        </div>
        <div className="flex gap-2">
          <Card className="w-1/2">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Asset ID</p>
                  <p className="text-sm font-medium leading-none">{asset.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-sm font-medium leading-none">
                    {asset.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="text-sm font-medium leading-none">
                    {asset.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-sm font-medium leading-none">
                    {asset.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-sm font-medium leading-none">
                    {asset.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-1/2">
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Specifications
                  </p>
                  <p className="text-sm font-medium leading-none">
                    Intel i7, 16GB RAM, 512GB SSD
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Date</p>
                  <p className="text-sm font-medium leading-none">
                    {asset.purchase_date}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Last Maintenance
                  </p>
                  <p className="text-sm font-medium leading-none">
                    {asset.last_maintenance_date
                      ? asset.last_maintenance_date
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Next Maintenance
                  </p>
                  <p className="text-sm font-medium leading-none">
                    {asset.next_maintenance_date
                      ? asset.next_maintenance_date
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssetDetails;
