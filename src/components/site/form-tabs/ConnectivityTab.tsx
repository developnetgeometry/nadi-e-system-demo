import { SelectOne } from "@/components/ui/SelectOne";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchTechnology,
  fetchBandwidth
} from "@/components/site/hook/site-utils";
import { SiteFormTabProps } from "./utils/types";

export const ConnectivityTab = ({
  form
}: SiteFormTabProps) => {
  // Fetch lookup data
  const { data: technologies = [], isLoading: isTechnologiesLoading } = useQuery({
    queryKey: ["technologies"],
    queryFn: fetchTechnology,
  });

  const { data: bandwidths = [], isLoading: isBandwidthsLoading } = useQuery({
    queryKey: ["bandwidths"],
    queryFn: fetchBandwidth,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Connectivity Information</h3>
        
        {/* Technology */}
        <FormField
          control={form.control}
          name="technology"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Internet Technology *</FormLabel>
              <FormControl>
                <SelectOne
                  options={technologies.map((tech) => ({
                    id: String(tech.id),
                    label: tech.name,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select internet technology"
                  disabled={isTechnologiesLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bandwidth */}
        <FormField
          control={form.control}
          name="bandwidth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bandwidth</FormLabel>
              <FormControl>
                <SelectOne
                  options={bandwidths.map((bandwidth) => ({
                    id: String(bandwidth.id),
                    label: bandwidth.name,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select bandwidth"
                  disabled={isBandwidthsLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Information</h3>
        
        <div className="text-sm text-muted-foreground">
          Please ensure the selected technology and bandwidth meet the site requirements.
        </div>
      </div>
    </div>
  );
};
