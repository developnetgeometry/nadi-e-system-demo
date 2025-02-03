import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Map from "@/components/ui/map";

export const DashboardMap = () => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Global Activity Map</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <Map />
      </CardContent>
    </Card>
  );
};