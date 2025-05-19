import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DialogTitle } from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import { useSiteByPhase } from "../hook/use-claim-data";

type ClaimData = {
  phase_id: number;
  site_profile_ids: number[];

};

type ClaimApplicationFormProps = ClaimData & {
  updateFields: (fields: Partial<ClaimData>) => void;

};


export function ClaimApplicationForm({
  phase_id,
  site_profile_ids,
  updateFields,
}: ClaimApplicationFormProps) {
  const { phases, isPhasesLoading, phasesError, fetchSitesByPhase } = useSiteByPhase();
  const [sites, setSites] = useState<{ id: number; name: string }[]>([]);

  const handleFetchSites = async (phaseId: number) => {
    const fetchedSites = await fetchSitesByPhase(phaseId);
    setSites(
      fetchedSites.map((site: { id: number; fullname: string }) => ({
        id: site.id,
        name: site.fullname,
      }))
    );
  };

  const handleCheckboxChange = (siteId: number, isChecked: boolean) => {
    const updatedSiteProfileIds = isChecked
      ? [...site_profile_ids, siteId]
      : site_profile_ids.filter((id) => id !== siteId);

    updateFields({ site_profile_ids: updatedSiteProfileIds });
  };

  useEffect(() => {
    if (phase_id) {
      handleFetchSites(phase_id);
    }
  }, [phase_id]);

  return (
    <>
      <DialogTitle className="mb-4">Phase and Sites</DialogTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Phase */}
        <div className="space-y-2">
          <Label className="flex items-center">Phase</Label>
          <Select
            value={phase_id?.toString() ?? ""}
            onValueChange={(value) => {
              updateFields({ phase_id: Number(value), site_profile_ids: [] }); // Reset site_profile_ids
              handleFetchSites(Number(value));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Phase" />
            </SelectTrigger>
            <SelectContent>
              {phases?.filter((phase) => phase !== null && phase !== undefined).map((phase) => (
                <SelectItem key={phase.id} value={String(phase.id)}>
                  {phase.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


        {/* Site Profile */}
        <div className="space-y-2 col-span-2">
          <Label className="flex items-center">Site Profiles</Label>
          {/* Select All Checkbox */}
          { phase_id  && (
          <div className="p-2 flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={site_profile_ids.length === sites.length && sites.length > 0} // Check if all sites are selected
              onChange={(e) => {
                if (e.target.checked) {
                  // Select all site IDs
                  const allSiteIds = sites.map((site) => site.id);
                  updateFields({ site_profile_ids: allSiteIds });
                } else {
                  // Reset site_profile_ids
                  updateFields({ site_profile_ids: [] });
                }
              }}
            />
            Select All
            <h1 className="ml-auto text-sm font-medium">
              NADI sites selected: {site_profile_ids.length}
            </h1>
          </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sites.length > 0 ? (
              sites.map((site) => (
                <div key={site.id} className="p-2 border rounded flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={site_profile_ids.includes(site.id)}
                    onChange={(e) => handleCheckboxChange(site.id, e.target.checked)}
                  />
                  {site.name}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No sites available. Please select a phase.</p>
            )}
          </div>
        </div>

      </div>
    </>
  );
}