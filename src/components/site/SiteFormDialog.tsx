//FORM STILL NOT COMPLETE
// TODO DUSP_TP UST CLUSTER
// 

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { fetchSiteStatus, fetchPhase, fetchRegion, fetchDistrict, fetchParliament, fetchMukim, fetchState, fetchDun, fetchTechnology, fetchBandwidth, fetchBuildingType, fetchZone, fetchCategoryArea, fetchBuildingLevel, Site } from "@/components/site/component/site-utils";
import { Textarea } from "../ui/textarea";

interface SiteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  site?: Site | null; // Add optional site prop for editing
}

export const SiteFormDialog = ({ open, onOpenChange, site }: SiteFormDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for form fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [phase, setPhase] = useState<any | undefined>(undefined);
  const [region, setRegion] = useState<any | undefined>(undefined);
  const [parliament, setParliament] = useState<any | undefined>(undefined);
  const [dun, setDun] = useState<any | undefined>(undefined);
  const [mukim, setMukim] = useState<any | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [status, setStatus] = useState<any | undefined>(undefined);
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [district, setDistrict] = useState<any | undefined>(undefined);
  const [city, setCity] = useState('');
  const [postCode, setPostCode] = useState('');
  const [state, setState] = useState<any | undefined>(undefined);
  const [technology, setTechnology] = useState<any | undefined>(undefined);
  const [bandwidth, setBandwidth] = useState<any | undefined>(undefined);
  const [building_type, setBuildingType] = useState<any | undefined>(undefined);
  const [building_area, setBuildingArea] = useState('');
  const [building_rental, setBuildingRental] = useState<boolean | undefined>(undefined); //boolean should be here
  const [zone, setZone] = useState<any | undefined>(undefined);
  const [category_area, setCategoryArea] = useState<any | undefined>(undefined);
  const [building_level, setBuildingLevel] = useState<any | undefined>(undefined);
  const [oku, setOku] = useState<boolean | undefined>(undefined);

  // Fetching START lookup data
  const { data: siteStatus = [], isLoading: isStatusLoading } = useQuery({
    queryKey: ['site-status'],
    queryFn: () => fetchSiteStatus(),
  });
  const { data: sitePhase = [], isLoading: isPhaseLoading } = useQuery({
    queryKey: ['site-phase'],
    queryFn: () => fetchPhase(),
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
    if (region === undefined) {
      setState(undefined);
      setDistrict(undefined);
      setMukim(undefined);
      setParliament(undefined);
      setDun(undefined);
    } else {
      queryClient.invalidateQueries({ queryKey: ['site-state', region] });
      setState(undefined);
      setDistrict(undefined);
      setMukim(undefined);
      setParliament(undefined);
      setDun(undefined);
    }
  }, [region, queryClient, isStateLoading]);

  useEffect(() => {
    if (site && !isStateLoading && region !== undefined) {
      setState(site.nd_site_address[0].state_id ?? undefined);
    }
  }, [isStateLoading, siteState, region]);

  useEffect(() => {
    if (state === undefined) {
      setDistrict(undefined);
      setMukim(undefined);
      setParliament(undefined);
      setDun(undefined);
    } else {
      queryClient.invalidateQueries({ queryKey: ['site-district', state] });
      queryClient.invalidateQueries({ queryKey: ['site-parliament', state] });
      setDistrict(undefined);
      setMukim(undefined);
      setParliament(undefined);
      setDun(undefined);
    }
  }, [state, queryClient, isDistrictLoading, isParliamentLoading]);

  useEffect(() => {
    if (site && !isDistrictLoading && state !== undefined) {
      setDistrict(site.nd_site_address[0].district_id ?? undefined);
    }
  }, [isDistrictLoading, siteDistrict, state]);

  useEffect(() => {
    if (site && !isParliamentLoading && state !== undefined) {
      setParliament(site.nd_parliament?.id ?? undefined);
    }
  }, [isParliamentLoading, siteParliament, state]);

  useEffect(() => {
    if (district === undefined) {
      setMukim(undefined);
    } else {
      queryClient.invalidateQueries({ queryKey: ['site-mukim', district] });
      setMukim(undefined);
    }
  }, [district, queryClient, isMukimLoading]);

  useEffect(() => {
    if (site && !isMukimLoading && district !== undefined) {
      setMukim(site.nd_mukim?.id ?? undefined);
    }
  }, [isMukimLoading, siteMukim, district]);

  useEffect(() => {
    if (parliament === undefined) {
      setDun(undefined);
    } else {
      queryClient.invalidateQueries({ queryKey: ['site-dun', parliament] });
      setDun(undefined);
    }
  }, [parliament, queryClient, isDunLoading]);

  useEffect(() => {
    if (site && !isDunLoading && parliament !== undefined) {
      setDun(site.nd_dun?.id);
    }
  }, [isDunLoading, siteDun, parliament]);
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
    setPhase(undefined);
    setRegion(undefined);
    setParliament(undefined);
    setDun(undefined);
    setMukim(undefined);
    setEmail('');
    setWebsite('');
    setLongitude('');
    setLatitude('');
    setStatus(undefined);
    setAddress('');
    setAddress2('');
    setCity('');
    setPostCode('');
    setDistrict(undefined);
    setState(undefined);
    setTechnology(undefined);
    setBandwidth(undefined);
    setBuildingType(undefined);
    setBuildingArea('');
    setBuildingRental(undefined);
    setZone(undefined);
    setCategoryArea(undefined);
    setBuildingLevel(undefined);
    setOku(undefined);
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (site) {
      // Populate form fields with site data for editing
      setCode(site.nd_site[0].standard_code || '');
      setName(site.sitename || '');
      setPhase(site.phase_id || undefined);
      setRegion(site.region_id || undefined);
      setParliament(site.nd_parliament?.id || undefined);
      setDun(site.nd_dun?.id || undefined);
      setMukim(site.nd_mukim?.id || undefined);
      setEmail(site.email || '');
      setWebsite(site.website || '');
      setLongitude(site.longtitude || '');
      setLatitude(site.latitude || '');
      setStatus(site.active_status || undefined);
      setAddress(site.nd_site_address[0].address1 || '');
      setAddress2(site.nd_site_address[0].address2 || '');
      setCity(site.nd_site_address[0].city || '');
      setPostCode(site.nd_site_address[0].postcode || '');
      setDistrict(site.nd_site_address[0].district_id || undefined);
      setState(site.nd_site_address[0].state_id || undefined);
      setTechnology(site.technology || undefined);
      setBandwidth(site.bandwidth || undefined);
      setBuildingType(site.building_type_id || undefined);
      setBuildingArea(site.building_area_id || '');
      setBuildingRental(site.building_rental_id || undefined);
      setZone(site.zone_id || undefined);
      setCategoryArea(site.area_id || undefined);
      setBuildingLevel(site.level_id || undefined);
      setOku(site.oku_friendly || undefined);

      // Enable dependent fields
      if (site.region_id) {
        queryClient.invalidateQueries({ queryKey: ['site-state', site.region_id] });
      }
      if (site.nd_site_address[0].state_id) {
        queryClient.invalidateQueries({ queryKey: ['site-district', site.nd_site_address[0].state_id] });
        queryClient.invalidateQueries({ queryKey: ['site-parliament', site.nd_site_address[0].state_id] });
      }
      if (site.nd_parliament?.id) {
        queryClient.invalidateQueries({ queryKey: ['site-dun', site.nd_parliament.id] });
      }
      if (site.nd_site_address[0].district_id) {
        queryClient.invalidateQueries({ queryKey: ['site-mukim', site.nd_site_address[0].district_id] });
      }
    } else {
      resetForm();
    }
  }, [site, queryClient]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const site_profile = {
      sitename: name || '',
      fullname: 'NADI' + (name || ''),
      phase_id: phase === '' ? null : phase,
      region_id: region === '' ? null : region,
      parliament_rfid: parliament === '' ? null : parliament,
      dun_rfid: dun === '' ? null : dun,
      mukim_id: mukim === '' ? null : mukim,
      email: email || '',
      website: website || '',
      longtitude: longitude ? parseFloat(longitude) : null,
      latitude: latitude ? parseFloat(latitude) : null,
      state_id: state === '' ? null : state,
      active_status: status === '' ? null : status,
      technology: technology === '' ? null : technology,
      building_area_id: building_area ? parseFloat(building_area) : null,
      bandwidth: bandwidth === '' ? null : bandwidth,
      building_type_id: building_type === '' ? null : building_type,
      building_rental_id: building_rental === undefined ? null : building_rental,
      zone_id: zone === '' ? null : zone,
      area_id: category_area === '' ? null : category_area,
      level_id: building_level === '' ? null : building_level,
      oku_friendly: oku ?? null,
    };

    const site_address = {
      address1: address || '',
      address2: address2 || '',
      city: city || '',
      postcode: postCode || '',
      district_id: district === '' ? null : district,
      state_id: state === '' ? null : state,
      active_status: status === '' ? null : status,
    };

    const standard_code = code;

    console.log(site_profile);
    console.log(site_address);

    try {
      if (site) {
        // Update existing site
        const { error: profError } = await supabase
          .from('nd_site_profile')
          .update(site_profile)
          .eq('id', site.id);

        if (profError) throw profError;

        const { error: addressError } = await supabase
          .from('nd_site_address')
          .update(site_address)
          .eq('site_id', site.id);

        if (addressError) throw addressError;

        const { error: codeError } = await supabase
          .from('nd_site')
          .update({ standard_code })
          .eq('site_profile_id', site.id);

        if (codeError) throw codeError;

        toast({
          title: "Site updated successfully",
          description: `The ${site.sitename} site has been updated in the system.`,
        });
      } else {
        // Create new site
        const { data: profData, error: profError } = await supabase
          .from('nd_site_profile')
          .insert([site_profile])
          .select('id');

        if (profError) throw profError;

        if (!profData) throw new Error('Profile data is null');
        const site_id = profData[0].id;

        const { error: addressError } = await supabase
          .from('nd_site_address')
          .insert([{ ...site_address, site_id: site_id }]);

        if (addressError) throw addressError;

        const { error: codeError } = await supabase
          .from('nd_site')
          .insert([{ standard_code: standard_code, site_profile_id: site_id }])
          .select('id');

        if (codeError) throw codeError;

        toast({
          title: "Site added successfully",
          description: `The ${site_profile.sitename} site has been added to the system.`,
        });
      }

      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['site-stats'] });
      queryClient.invalidateQueries({ queryKey: ['sites'] });

      resetForm();
    } catch (error) {
      console.error('Error adding/updating site:', error);
      toast({
        title: "Error",
        description: "Failed to add/update the site. Please try again.",
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
          <DialogTitle className="text-2xl">{site ? "Edit Site" : "Add New Site"}</DialogTitle>
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
                    <SelectItem value={undefined}>..</SelectItem>
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
                    <SelectItem value={undefined}>..</SelectItem>
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
                    <SelectItem value={undefined}>..</SelectItem>
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
                <Input id="building_area" name="building_area" type="number" placeholder="0" value={building_area} onChange={(e) => setBuildingArea(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="building_rental">Building rental</Label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="building_rental"
                      checked={building_rental === true}
                      onChange={() => setBuildingRental(true)}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="building_rental"
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
                <Select name="zone" value={zone ?? undefined} onValueChange={setZone} disabled={isZoneLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined}>..</SelectItem>
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
                    <SelectItem value={undefined}>..</SelectItem>
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
                    <SelectItem value={undefined}>..</SelectItem>
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
                      type="radio"
                      name="oku"
                      checked={oku === true}
                      onChange={() => setOku(true)}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="oku"
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
                    <SelectItem value={undefined}>..</SelectItem> {/* Add clearable option */}
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
                    <SelectItem value={undefined}>..</SelectItem> {/* Add clearable option */}
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
                    <SelectItem value={undefined}>..</SelectItem> {/* Add clearable option */}
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
                    <SelectItem value={undefined}>..</SelectItem> {/* Add clearable option */}
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
                    <SelectItem value={undefined}>..</SelectItem> {/* Add clearable option */}
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
                    <SelectItem value={undefined}>..</SelectItem> {/* Add clearable option */}
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
              {isSubmitting ? (site ? "Updating..." : "Adding...") : (site ? "Update Site" : "Add Site")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SiteFormDialog;