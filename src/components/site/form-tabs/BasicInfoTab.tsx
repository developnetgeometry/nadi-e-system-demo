import { Input } from "@/components/ui/input";
import { SelectOne } from "@/components/ui/SelectOne";
import { DateInput } from "@/components/ui/date-input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchSiteStatus, 
  fetchPhase, 
  fetchOrganization 
} from "@/components/site/hook/site-utils";
import { BasicInfoTabProps } from "./utils/types";

export const BasicInfoTab = ({
  form,
  isSuperAdmin
}: BasicInfoTabProps) => {
  // Fetch lookup data
  const { data: siteStatus = [], isLoading: isStatusLoading } = useQuery({
    queryKey: ["site-status"],
    queryFn: () => fetchSiteStatus(),
  });
  
  const { data: sitePhase = [], isLoading: isPhaseLoading } = useQuery({
    queryKey: ["site-phase"],
    queryFn: () => fetchPhase(),
  });

  const { data: organizations = [], isLoading: isOrganizationsLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: fetchOrganization,
    enabled: isSuperAdmin,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        {/* Site Code */}
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Code *</FormLabel>
              <FormControl>
                <Input
                  id="code"
                  placeholder="Enter site code"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Site Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Name *</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  placeholder="Enter site name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Site Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Status *</FormLabel>
              <FormControl>
                <SelectOne
                  options={siteStatus.map((status) => ({
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

        {/* Phase */}
        <FormField
          control={form.control}
          name="phase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phase *</FormLabel>
              <FormControl>
                <SelectOne
                  options={sitePhase.map((phase) => ({
                    id: String(phase.id),
                    label: phase.name,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select phase"
                  disabled={isPhaseLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DUSP TP ID for super admin */}
        {isSuperAdmin && (
          <FormField
            control={form.control}
            name="dusp_tp_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TP (DUSP) *</FormLabel>
                <FormControl>
                  <SelectOne
                    options={organizations.map((org) => ({
                      id: String(org.id),
                      label: org.name,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select organization"
                    disabled={isOrganizationsLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact & Operation Details</h3>
        
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Website */}
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  id="website"
                  type="url"
                  placeholder="Enter website URL"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Operation Date */}
        <FormField
          control={form.control}
          name="operate_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operation Date</FormLabel>
              <FormControl>
                <DateInput
                  id="operate_date"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select operation date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
