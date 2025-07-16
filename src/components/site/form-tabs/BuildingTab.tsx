import { Input } from "@/components/ui/input";
import { SelectOne } from "@/components/ui/SelectOne";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchBuildingType,
  fetchZone,
  fetchCategoryArea,
  fetchBuildingLevel
} from "@/components/site/hook/site-utils";
import { SiteFormTabProps } from "./utils/types";

export const BuildingTab = ({
  form
}: SiteFormTabProps) => {
  // Fetch lookup data
  const { data: buildingTypes = [], isLoading: isBuildingTypesLoading } = useQuery({
    queryKey: ["building-types"],
    queryFn: fetchBuildingType,
  });

  const { data: zones = [], isLoading: isZonesLoading } = useQuery({
    queryKey: ["zones"],
    queryFn: fetchZone,
  });

  const { data: areaCategories = [], isLoading: isAreaCategoriesLoading } = useQuery({
    queryKey: ["area-categories"],
    queryFn: fetchCategoryArea,
  });

  const { data: buildingLevels = [], isLoading: isBuildingLevelsLoading } = useQuery({
    queryKey: ["building-levels"],
    queryFn: fetchBuildingLevel,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Building Specifications</h3>
        
        {/* Building Type */}
        <FormField
          control={form.control}
          name="building_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Building Type *</FormLabel>
              <FormControl>
                <SelectOne
                  options={buildingTypes.map((type) => ({
                    id: String(type.id),
                    label: type.eng,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select building type"
                  disabled={isBuildingTypesLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Building Area */}
        <FormField
          control={form.control}
          name="building_area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Building Area (sq ft)</FormLabel>
              <FormControl>
                <Input
                  id="building_area"
                  type="number"
                  placeholder="Enter building area"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Building Level */}
        <FormField
          control={form.control}
          name="building_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Building Level</FormLabel>
              <FormControl>
                <SelectOne
                  options={buildingLevels.map((level) => ({
                    id: String(level.id),
                    label: level.eng,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select building level"
                  disabled={isBuildingLevelsLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Location & Zoning</h3>
        
        {/* Zone */}
        <FormField
          control={form.control}
          name="zone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zone</FormLabel>
              <FormControl>
                <SelectOne
                  options={zones.map((zone) => ({
                    id: String(zone.id),
                    label: zone.area,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select zone"
                  disabled={isZonesLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Area */}
        <FormField
          control={form.control}
          name="category_area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Area</FormLabel>
              <FormControl>
                <SelectOne
                  options={areaCategories.map((category) => ({
                    id: String(category.id),
                    label: category.name,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select category area"
                  disabled={isAreaCategoriesLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 pt-4">
          <h4 className="text-base font-medium">Building Properties</h4>
          
          {/* Mini Site */}
          <FormField
            control={form.control}
            name="is_mini"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Mini Site</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Check if this is a mini site
                  </p>
                </div>
              </FormItem>
            )}
          />

          {/* Building Rental */}
          <FormField
            control={form.control}
            name="building_rental"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Building Rental</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Check if this building is rented
                  </p>
                </div>
              </FormItem>
            )}
          />

          {/* OKU Friendly */}
          <FormField
            control={form.control}
            name="oku"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>OKU Friendly</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Check if this building is OKU friendly
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
