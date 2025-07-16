import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchSocioecomic,
  fetchSiteSpace
} from "@/components/site/hook/site-utils";
import { SiteFormTabProps } from "./utils/types";

export const FacilitiesTab = ({
  form
}: SiteFormTabProps) => {
  // Fetch lookup data
  const { data: socioEconomics = [], isLoading: isSocioEconomicsLoading } = useQuery({
    queryKey: ["socio-economics"],
    queryFn: fetchSocioecomic,
  });

  const { data: spaces = [], isLoading: isSpacesLoading } = useQuery({
    queryKey: ["spaces"],
    queryFn: fetchSiteSpace,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Socio-Economic Categories</h3>
        
        <FormField
          control={form.control}
          name="socio_economic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select applicable socio-economic categories:</FormLabel>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                {socioEconomics.map((item) => (
                  <FormItem
                    key={item.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(String(item.id))}
                        onCheckedChange={(checked) => {
                          const currentValue = field.value || [];
                          if (checked) {
                            field.onChange([...currentValue, String(item.id)]);
                          } else {
                            field.onChange(
                              currentValue.filter((value) => value !== String(item.id))
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      {item.eng}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Space Categories</h3>
        
        <FormField
          control={form.control}
          name="space"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select applicable space categories:</FormLabel>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                {spaces.map((item) => (
                  <FormItem
                    key={item.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(String(item.id))}
                        onCheckedChange={(checked) => {
                          const currentValue = field.value || [];
                          if (checked) {
                            field.onChange([...currentValue, String(item.id)]);
                          } else {
                            field.onChange(
                              currentValue.filter((value) => value !== String(item.id))
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      {item.eng}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
