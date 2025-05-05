import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const NADIInfo = () => {
  return (
    <Card
      className="mb-6 bg-gradient-to-br from-soft-purple/20 to-soft-blue/20"
      id="info"
    >
      <CardHeader>
        <CardTitle className="text-zinc-950">NADI Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                NADI Sitename & REFID
              </label>
              <p className="text-lg font-semibold text-primary">
                NADI Cyberjaya #REF001
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                REFID MCMC
              </label>
              <p className="text-lg font-semibold text-primary">
                MCMC-2023-001
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Date of Operation
              </label>
              <p className="text-lg font-semibold">13 March 2022</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Year of Services
              </label>
              <p className="text-lg font-semibold">3 years 2 months 12 days</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <Badge
                variant="default"
                className="bg-green-500 hover:bg-green-600"
              >
                Active
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NADIInfo;
