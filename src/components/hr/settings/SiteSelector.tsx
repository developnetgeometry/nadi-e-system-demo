import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

interface Site {
  id: string;
  sitename: string;
}

interface SiteSelectorProps {
  onSiteChange: (siteId: string | null) => void;
  selectedSiteId: string | null;
}

export function SiteSelector({
  onSiteChange,
  selectedSiteId,
}: SiteSelectorProps) {
  const [open, setOpen] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  useEffect(() => {
    async function fetchSites() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("nd_site_profile")
          .select("id, sitename")
          .order("sitename");

        if (error) throw error;
        setSites(data as Site[]);

        // If a site ID is already selected, set the selected site
        if (selectedSiteId) {
          const site = data.find((site: Site) => site.id === selectedSiteId);
          if (site) setSelectedSite(site);
        }
      } catch (error) {
        console.error("Error fetching sites:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSites();
  }, [selectedSiteId]);

  const handleSiteSelect = (siteId: string) => {
    const site = sites.find((site) => site.id === siteId);
    setSelectedSite(site || null);
    onSiteChange(siteId);
    setOpen(false);
  };

  if (loading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between md:w-[300px]"
        >
          {selectedSite ? selectedSite.sitename : "Select a site..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 md:w-[300px]">
        <Command>
          <CommandInput placeholder="Search sites..." />
          <CommandEmpty>No sites found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {sites.map((site) => (
              <CommandItem
                key={site.id}
                value={site.id}
                onSelect={handleSiteSelect}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedSite?.id === site.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {site.sitename}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
