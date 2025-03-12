//FORM STILL NOT COMPLETE
// TODO DUSP_TP
// 

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { fetchSiteStatus, fetchPhase, fetchRegion, fetchDistrict, fetchParliament, fetchMukim, fetchState, fetchDun, fetchTechnology, fetchBandwidth, fetchBuildingType, fetchZone, fetchCategoryArea, fetchBuildingLevel } from "@/components/site/component/site-utils";
import { Textarea } from "../ui/textarea";

interface SiteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SiteFormDialog = ({ open, onOpenChange }: SiteFormDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for form fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [phase, setPhase] = useState<any | null>(null);
  const [region, setRegion] = useState<any | null>(null);
  const [parliament, setParliament] = useState<any | null>(null);
  const [dun, setDun] = useState<any | null>(null);
  const [mukim, setMukim] = useState<any | null>(null);
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [longitude, setLongitude] = useState('')
  const [latitude, setLatitude] = useState('')
  const [status, setStatus] = useState<any | null>(null);
  const [address, setAddress] = useState('')
  const [address2, setAddress2] = useState('')
  const [district, setDistrict] = useState<any | null>(null);
  const [city, setCity] = useState('')
  const [postCode, setPostCode] = useState('')
  const [state, setState] = useState<any | null>(null);
  const [technology, setTechnology] = useState<any | null>(null);
  const [bandwidth, setBandwidth] = useState<any | null>(null);
  const [building_type, setBuildingType] = useState<any | null>(null);
  const [building_area, setBuildingArea] = useState<any | null>(null);
  const [building_rental, setBuildingRental] = useState<boolean | null>(null); //boolean should be here
  const [zone, setZone] = useState<any | null>(null);
  const [category_area, setCategoryArea] = useState<any | null>(null);
  const [building_level, setBuildingLevel] = useState<any | null>(null);
  const [oku, setOku] = useState<boolean | null>(null);

  // Fetching START lookup data
  const { data: siteStatus = [], isLoading: isStatusLoading } = useQuery({
    queryKey: ['site-status'],
    queryFn: ()=>fetchSiteStatus(),
  });
  const { data: sitePhase = [], isLoading: isPhaseLoading } = useQuery({
    queryKey: ['site-phase'],
    queryFn: ()=>fetchPhase(),
  });
  const { data: siteState = [], isLoading: isStateLoading } = useQuery({
    queryKey: ['site-state', region],
    queryFn: () => fetchState(region),
    enabled: !!region,
  });

  const { data: siteDistrict = [], isLoading: isDistrictLoading } = useQuery({
    queryKey: ['site-district', state],
    queryFn: () => fetchDistrict(state),
    enabled: !!state,
  });

  const { data: siteParliament = [], isLoading: isParliamentLoading } = useQuery({
    queryKey: ['site-parliament', state],
    queryFn: () => fetchParliament(state),
    enabled: !!state,
  });

  const { data: siteDun = [], isLoading: isDunLoading } = useQuery({
    queryKey: ['site-dun', parliament],
    queryFn: () => fetchDun(parliament),
    enabled: !!parliament,
  });

  const { data: siteMukim = [], isLoading: isMukimLoading } = useQuery({
    queryKey: ['site-Mukim', district],
    queryFn: () => fetchMukim(district),
    enabled: !!district,
  });

  const { data: siteRegion = [], isLoading: isRegionLoading } = useQuery({
    queryKey: ['site-region'],
    queryFn: fetchRegion,
  });

  const { data: siteTechnology = [], isLoading: isTechnologyLoading } = useQuery({
    queryKey: ['site-technology'],
    queryFn: fetchTechnology,
  });
  const { data: siteBandwidth = [], isLoading: isBandwidthLoading } = useQuery({
    queryKey: ['site-bandwidth'],
    queryFn: fetchBandwidth,
  });
  const { data: siteBuildingType = [], isLoading: isBuildingTypeLoading } = useQuery({
    queryKey: ['site-BuidlingType'],
    queryFn: fetchBuildingType,
  });
  const { data: siteZone = [], isLoading: isZoneLoading } = useQuery({
    queryKey: ['site-Zone'],
    queryFn: fetchZone,
  });
  const { data: siteCategoryArea = [], isLoading: isCategoryAreaLoading } = useQuery({
    queryKey: ['site-CategoryArea'],
    queryFn: fetchCategoryArea,
  });
  const { data: siteBuildingLevel = [], isLoading: isBuildingLevelLoading } = useQuery({
    queryKey: ['site-BuildingLevel'],
    queryFn: fetchBuildingLevel,
  });
  // Fetching END lookup data


  // Fetching dependent data based on selected value START
  useEffect(() => {
    if (state === null) {
      setDistrict(null); // Reset district when state is null
      setMukim(null); // Reset mukim when state is null
      setParliament(null); // Reset parliament when state is null
      setDun(null); // Reset dun when state is null
    } else {
      queryClient.invalidateQueries({ queryKey: ['site-district'] });
      queryClient.invalidateQueries({ queryKey: ['site-parliament'] });
      setDistrict(null); // Reset district when state changes
      setMukim(null); // Reset mukim when state changes
      setParliament(null); // Reset parliament when state changes
      setDun(null); // Reset dun when state changes
    }
  }, [state, queryClient]);

  useEffect(() => {
    if (parliament === null) {
      setDun(null); // Reset dun when parliament is null
    } else {
      queryClient.invalidateQueries({ queryKey: ['site-dun'] });
      setDun(null); // Reset dun when parliament changes
    }
  }, [parliament, queryClient]);

  useEffect(() => {
    if (district === null) {
      setMukim(null); // Reset mukim when district is null
    } else {
      queryClient.invalidateQueries({ queryKey: ['site-mukim'] });
      setMukim(null); // Reset mukim when district changes
    }
  }, [district, queryClient]);

  useEffect(() => {
    if (region === null) {
      setState(null); // Reset state when region is null
      setDistrict(null); // Reset district when region is null
      setMukim(null); // Reset mukim when region is null
      setParliament(null); // Reset parliament when region is null
      setDun(null); // Reset dun when region is null
    } else {
      queryClient.invalidateQueries({ queryKey: ['site-state'] });
      setState(null); // Reset state when region changes
      setDistrict(null); // Reset district when region changes
      setMukim(null); // Reset mukim when region changes
      setParliament(null); // Reset parliament when region changes
      setDun(null); // Reset dun when region changes
    }
  }, [region, queryClient]);
  // Fetching dependent data based on selected value END

  //preset on 2nd value of status
  useEffect(() => {
    if (siteStatus.length > 1 && !status) {
      setStatus(String(siteStatus[1].id));
    }
  }, [siteStatus, status]);

  const resetForm = () => {
    setCode('');
    setName('');
    setPhase(null);
    setRegion(null);
    setParliament(null);
    setDun(null);
    setMukim(null);
    setEmail('');
    setWebsite('');
    setLongitude('');
    setLatitude('');
    setStatus(null);
    setAddress('');
    setAddress2('');
    setCity('');
    setPostCode('');
    setDistrict(null);
    setState(null);
    setTechnology(null);
    setBandwidth(null);
    setBuildingType(null);
    setBuildingArea(null);
    setBuildingRental(null);
    setZone(null);
    setCategoryArea(null);
    setBuildingLevel(null);
    setOku(null);
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const site_profile = {
      sitename: name,
      fullname: 'NADI' + name,
      phase_id: phase,
      region_id: region,
      parliament_rfid: parliament,
      mukim_id: mukim,
      email: email,
      website: website,
      longtitude: longitude,
      latitude: latitude,
      state_id: state,
      active_status: status,
      technology: technology,
      building_area_id: building_area,
      bandwidth: bandwidth,
      building_type_id: building_type,
      building_rental_id: building_rental,
      zone_id: zone,
      area_id: category_area,
      level_id: building_level,
      oku_friendly: oku,

    };
    const site_address = {
      address1: address,
      address2: address2,
      city: city,
      postcode: postCode,
      district_id: district,
      state_id: state,
      active_status: status,
    };
    const standard_code = code;

    console.log(site_profile);
    console.log(site_address);

    try {

      console.log('Creating new site profile:');
      const { data: profData, error: profError } = await supabase
        .from('nd_site_profile')
        .insert([site_profile])
        .select('id');

      if (profError) throw profError;

      if (!profData) throw new Error('Profile data is null');
      const site_id = profData[0].id;

      console.log('Creating new site address:');
      const { error: addressError } = await supabase
        .from('nd_site_address')
        .insert([{ ...site_address, site_id: site_id}]);

      if (addressError) throw addressError;

      toast({
        title: "Site added successfully",
        description: "The new site has been added to the system.",
      });

      console.log('Creating new site code:');
      const {error: codeError } = await supabase
        .from('nd_site')
        .insert([{standard_code:standard_code,site_profile_id:site_id}])
        .select('id');

      if (codeError) throw codeError;

      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['site-stats'] });
      queryClient.invalidateQueries({ queryKey: ['sites'] });

      // Reset form fields
      resetForm();

    } catch (error) {
      console.error('Error adding site:', error);
      toast({
        title: "Error",
        description: "Failed to add the site. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Site</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* Section 1 */}
            <div className="flex-1 space-y-4">
              <DialogTitle>Site Information</DialogTitle>
              <div className="space-y-2">
                <Label htmlFor="name">Site Name</Label>
                <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Site Code</Label>
                <Input id="code" name="code" value={code} onChange={(e) => setCode(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phase">Phase</Label>
                <Select name="phase" value={phase ?? undefined} onValueChange={setPhase} disabled={isPhaseLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>..</SelectItem> {/* Add clearable option */}
                    {sitePhase.map((phase) => (
                      <SelectItem key={phase.id} value={String(phase.id)}>
                        {phase.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude & Latitude</Label>
                <div className="flex space-x-2">
                  <Input id="longitude" name="longitude" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                  <Input id="latitude" name="latitude" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="technology">Internet Technology</Label>
                <Select name="technology" value={technology ?? undefined} onValueChange={setTechnology} disabled={isTechnologyLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select technology" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteTechnology.map((tech) => (
                      <SelectItem key={tech.id} value={String(tech.id)}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bandwidth">Internet Speed (Mbps)</Label>
                <Select name="bandwidth" value={bandwidth ?? undefined} onValueChange={setBandwidth} disabled={isBandwidthLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bandwidth" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteBandwidth.map((bandwidth) => (
                      <SelectItem key={bandwidth.id} value={String(bandwidth.id)}>
                        {bandwidth.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="status">Socioeconomic</Label>
                <Select name="status" value={status ?? undefined} onValueChange={setStatus} disabled={isStatusLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteStatus.map((status) => (
                      <SelectItem key={status.id} value={String(status.id)}>
                        {status.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="building_type">Building type</Label>
                <Select name="building_type" value={building_type ?? undefined} onValueChange={setBuildingType} disabled={isBuildingTypeLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select building type" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteBuildingType.map((type) => (
                      <SelectItem key={type.id} value={String(type.id)}>
                        {type.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="building_area">Building Area (sqft)</Label>
                <Input id="building_area" name="building_area" placeholder="0" value={building_area} onChange={(e) => setBuildingArea(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="building_rental">Building rental</Label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={building_rental === true}
                      onChange={() => setBuildingRental(true)}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={building_rental === false}
                      onChange={() => setBuildingRental(false)}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="status">Space</Label>
                <Select name="status" value={status ?? undefined} onValueChange={setStatus} disabled={isStatusLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteStatus.map((status) => (
                      <SelectItem key={status.id} value={String(status.id)}>
                        {status.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="zone">Zone</Label>
                <Select name="zone" value={ zone ?? undefined} onValueChange={setZone} disabled={isZoneLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteZone.map((zone) => (
                      <SelectItem key={zone.id} value={String(zone.id)}>
                        {zone.area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Category Area</Label>
                <Select name="area" value={category_area ?? undefined} onValueChange={setCategoryArea} disabled={isCategoryAreaLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category Area" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteCategoryArea.map((catA) => (
                      <SelectItem key={catA.id} value={String(catA.id)}>
                        {catA.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="building_level">Building level</Label>
                <Select name="building_level" value={building_level ?? undefined} onValueChange={setBuildingLevel} disabled={isBuildingLevelLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select building level" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteBuildingLevel.map((level) => (
                      <SelectItem key={level.id} value={String(level.id)}>
                        {level.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="oku">OKU Friendly</Label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={oku === true}
                      onChange={() => setOku(true)}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={oku === false}
                      onChange={() => setOku(false)}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="status">Cluster</Label>
                <Select name="status" value={status ?? undefined} onValueChange={setStatus} disabled={isStatusLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteStatus.map((status) => (
                      <SelectItem key={status.id} value={String(status.id)}>
                        {status.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={status ?? undefined} onValueChange={setStatus} disabled={isStatusLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteStatus.map((status) => (
                      <SelectItem key={status.id} value={String(status.id)}>
                        {status.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="border-l border-gray-300"></div>
            {/* Section 2 */}
            <div className="flex-1 space-y-4">
              <DialogTitle>Address Information</DialogTitle>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address2">Address 2 (Optional)</Label>
                <Textarea id="address2" name="address2" value={address2} onChange={(e) => setAddress2(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postCode">Postcode</Label>
                <Input id="postCode" name="postCode" value={postCode} onChange={(e) => setPostCode(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select name="region" value={region ?? undefined} onValueChange={setRegion} disabled={isRegionLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>..</SelectItem> {/* Add clearable option */}
                    {siteRegion.map((region) => (
                      <SelectItem key={region.id} value={String(region.id)}>
                        {region.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select name="state" value={state ?? ''} onValueChange={setState} disabled={isStateLoading || !region}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>..</SelectItem> {/* Add clearable option */}
                    {siteState.map((state) => (
                      <SelectItem key={state.id} value={String(state.id)}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Select name="district" value={district ?? ''} onValueChange={setDistrict} disabled={isDistrictLoading || !state}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>..</SelectItem> {/* Add clearable option */}
                    {siteDistrict.map((district) => (
                      <SelectItem key={district.id} value={String(district.id)}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mukim">Mukim</Label>
                <Select name="mukim" value={mukim ?? ''} onValueChange={setMukim} disabled={isMukimLoading || !district}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mukim" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>..</SelectItem> {/* Add clearable option */}
                    {siteMukim.map((mukim) => (
                      <SelectItem key={mukim.id} value={String(mukim.id)}>
                        {mukim.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parliament">Parliament</Label>
                <Select name="parliament" value={parliament ?? ''} onValueChange={setParliament} disabled={isParliamentLoading || !state}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parliament" />
                  </SelectTrigger>
                  <SelectContent> 
                    <SelectItem value={null}>..</SelectItem> {/* Add clearable option */}
                    {siteParliament.map((parliament) => (
                      <SelectItem key={parliament.id} value={String(parliament.id)}>
                        {parliament.fullname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dun">Dun</Label>
                <Select name="dun" value={dun ?? ''} onValueChange={setDun} disabled={isDunLoading || !parliament}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>..</SelectItem> {/* Add clearable option */}
                    {siteDun.map((dun) => (
                      <SelectItem key={dun.id} value={String(dun.id)}>
                        {dun.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* <div className="border-l border-gray-300"></div> */}
            {/* Section 3 */}
            {/* <div className="flex-1 space-y-4">

            </div> */}
          </div>
          {/* <div className="border-t border-gray-300"></div> */}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Site"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SiteFormDialog;