import { Input } from "@/components/ui/input";
import { SelectOne } from "@/components/ui/SelectOne";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchSiteStatus } from "@/components/site/hook/site-utils";
import { SiteFormTabProps } from "./utils/types";

export const OperationalStatusTab = ({
  form
}: SiteFormTabProps) => {
  const [initialStatus, setInitialStatus] = useState<string>("");
  const [showWarning, setShowWarning] = useState(false);
  const currentStatus = form.watch("status");

  // Fetch site status options
  const { data: siteStatuses = [], isLoading: isStatusLoading } = useQuery({
    queryKey: ["site-statuses"],
    queryFn: fetchSiteStatus,
  });

  // Set initial status when form loads
  useEffect(() => {
    if (currentStatus && !initialStatus) {
      setInitialStatus(currentStatus);
    }
  }, [currentStatus, initialStatus]);

  // Show warning when status changes
  useEffect(() => {
    if (initialStatus && currentStatus && currentStatus !== initialStatus) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [currentStatus, initialStatus]);

  return (
    <div className="space-y-6">
      {/* Warning when status changes */}
      {showWarning && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Warning:</strong> Changing site status affects real-time operations and may impact service availability.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Site Status</h3>

        {/* Site Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Status *</FormLabel>
              <FormControl>
                <SelectOne
                  options={siteStatuses.map((status) => ({
                    id: String(status.id),
                    label: status.eng,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select site status"
                  disabled={isStatusLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Operational Information</h3>

        {/* Operation Date */}
        <FormField
          control={form.control}
          name="operate_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operation Start Date</FormLabel>
              <FormControl>
                <Input
                  id="operate_date"
                  type="date"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
    </div>
  );
};
