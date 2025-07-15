import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectOne } from "@/components/ui/SelectOne";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchRegion,
  fetchAllStates,
  fetchAllDistricts,
  fetchAllParliaments,
  fetchAllDuns,
  fetchAllMukims,
} from "@/components/site/hook/site-utils";
import { LocationTabProps } from "./utils/types";

export const LocationTab = ({
  form
}: LocationTabProps) => {
  // Helper function to handle coordinate updates
  const handleCoordinatesChange = (value: string) => {
    form.setValue("coordinates", value);
    if (value.trim() === "") {
      form.setValue("longitude", "");
      form.setValue("latitude", "");
    } else if (value.includes(",")) {
      const [longitude, latitude] = value
        .split(",")
        .map((coord) => coord.trim());
      form.setValue("longitude", longitude);
      form.setValue("latitude", latitude);
    }
  };

  // Fetch lookup data
  const { data: siteRegion = [], isLoading: isRegionLoading } = useQuery({
    queryKey: ["site-region"],
    queryFn: fetchRegion,
  });

  const { data: siteState = [], isLoading: isStateLoading } = useQuery({
    queryKey: ["site-state"],
    queryFn: fetchAllStates,
  });

  const { data: siteDistrict = [], isLoading: isDistrictLoading } = useQuery({
    queryKey: ["site-district"],
    queryFn: fetchAllDistricts,
  });

  const { data: siteParliament = [], isLoading: isParliamentLoading } = useQuery({
    queryKey: ["all-parliaments"],
    queryFn: fetchAllParliaments,
  });

  const { data: siteDun = [], isLoading: isDunLoading } = useQuery({
    queryKey: ["all-duns"],
    queryFn: fetchAllDuns,
  });

  const { data: siteMukim = [], isLoading: isMukimLoading } = useQuery({
    queryKey: ["all-mukims"],
    queryFn: fetchAllMukims,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Address Information</h3>
        
        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address *</FormLabel>
              <FormControl>
                <Textarea
                  id="address"
                  placeholder="Enter site address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address 2 */}
        <FormField
          control={form.control}
          name="address2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address 2 (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  id="address2"
                  placeholder="Enter additional address information"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City *</FormLabel>
              <FormControl>
                <Input
                  id="city"
                  placeholder="Enter city"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Postcode */}
        <FormField
          control={form.control}
          name="postCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postcode *</FormLabel>
              <FormControl>
                <Input
                  id="postCode"
                  placeholder="Enter postcode"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* State */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State *</FormLabel>
              <FormControl>
                <SelectOne
                  options={siteState.map((state) => ({
                    id: String(state.id),
                    label: state.name,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select state"
                  disabled={isStateLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* District */}
        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>District</FormLabel>
              <FormControl>
                <SelectOne
                  options={siteDistrict.map((district) => ({
                    id: String(district.id),
                    label: district.name,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select district"
                  disabled={isDistrictLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Geographic Information</h3>
        
        {/* Region */}
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region</FormLabel>
              <FormControl>
                <SelectOne
                  options={siteRegion.map((region) => ({
                    id: String(region.id),
                    label: region.eng,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select region"
                  disabled={isRegionLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Coordinates */}
        <FormField
          control={form.control}
          name="coordinates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coordinates (Longitude, Latitude)</FormLabel>
              <FormControl>
                <Input
                  id="coordinates"
                  placeholder="e.g., 103.8198, 1.3521"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleCoordinatesChange(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Parliament */}
        <FormField
          control={form.control}
          name="parliament"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parliament</FormLabel>
              <FormControl>
                <SelectOne
                  options={siteParliament.map((parliament) => ({
                    id: String(parliament.id),
                    label: parliament.fullname,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select parliament"
                  disabled={isParliamentLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DUN */}
        <FormField
          control={form.control}
          name="dun"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DUN</FormLabel>
              <FormControl>
                <SelectOne
                  options={siteDun.map((dun) => ({
                    id: String(dun.id),
                    label: dun.full_name,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select dun"
                  disabled={isDunLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mukim */}
        <FormField
          control={form.control}
          name="mukim"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mukim</FormLabel>
              <FormControl>
                <SelectOne
                  options={siteMukim.map((mukim) => ({
                    id: String(mukim.id),
                    label: mukim.name,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select mukim"
                  disabled={isMukimLoading}
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
