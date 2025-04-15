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
import { fetchSiteStatus, fetchPhase, fetchRegion, fetchDistrict, fetchParliament, fetchMukim, fetchState, fetchDun, fetchTechnology, fetchBandwidth, fetchBuildingType, fetchZone, fetchCategoryArea, fetchBuildingLevel, Site, fetchSocioecomic, fetchSiteSpace, fetchOrganization } from "@/components/site/component/site-utils";
import { Textarea } from "../ui/textarea";
import { DateInput } from "@/components/ui/date-input";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { SelectMany } from "@/components/ui/SelectMany";

interface SiteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  site?: Site | null; // Add optional site prop for editing
}

export const SiteFormDialog = ({ open, onOpenChange, site }: SiteFormDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Retrieve user metadata
  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const organizationId =
    parsedMetadata?.user_type !== "super_admin" &&
    parsedMetadata?.user_group_name === "TP" &&
    parsedMetadata?.organization_id
      ? parsedMetadata.organization_id
      : null;

  // Hooks must be called unconditionally
  const [formState, setFormState] = useState({
    code: '',
    name: '',
    phase: undefined,
    region: undefined,
    parliament: undefined,
    dun: undefined,
    mukim: undefined,
    email: '',
    website: '',
    longitude: '',
    latitude: '',
    status: undefined,
    address: '',
    address2: '',
    district: undefined,
    city: '',
    postCode: '',
    state: undefined,
    technology: undefined,
    bandwidth: undefined,
    building_type: undefined,
    building_area: '',
    building_rental: undefined,
    zone: undefined,
    category_area: undefined,
    building_level: undefined,
    oku: undefined,
    coordinates: '',
    operate_date: '', // Add operate_date field
    socio_economic: [], // Add socio_economic field
    space: [], // Add space field
    dusp_tp_id: undefined, // Add dusp_tp_id field
  });

  // Fetch socio-economic options
  const { data: socioEconomicOptions = [], isLoading: isSocioEconomicLoading } = useQuery({
    queryKey: ['socio-economic'],
    queryFn: fetchSocioecomic,
  });

  // Fetch site space options
  const { data: siteSpaceOptions = [], isLoading: isSiteSpaceLoading } = useQuery({
    queryKey: ['site-space'],
    queryFn: fetchSiteSpace,
  });

  // Fetch organization options for super admin
  const { data: organizations = [], isLoading: isOrganizationsLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganization,
    enabled: parsedMetadata?.user_type === "super_admin", // Only fetch for super admin
  });

  const setField = (field: string, value: any) => {
    if (field === 'coordinates') {
      setFormState((prevState) => ({ ...prevState, coordinates: value }));
      if (value.trim() === '') {
        setFormState((prevState) => ({ ...prevState, longitude: '', latitude: '' }));
      } else if (value.includes(',')) {
        const [longitude, latitude] = value.split(',').map(coord => coord.trim());
        setFormState((prevState) => ({ ...prevState, longitude, latitude }));
      }
    } else {
      setFormState((prevState) => ({ ...prevState, [field]: value }));
    }
  };

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
    queryKey: ['site-state', formState.region],
    queryFn: () => fetchState(formState.region),
    enabled: !!formState.region,
  });

  const { data: siteDistrict = [], isLoading: isDistrictLoading } = useQuery({
    queryKey: ['site-district', formState.state],
    queryFn: () => fetchDistrict(formState.state),
    enabled: !!formState.state,
  });

  const { data: siteParliament = [], isLoading: isParliamentLoading } = useQuery({
    queryKey: ['site-parliament', formState.state],
    queryFn: () => fetchParliament(formState.state),
    enabled: !!formState.state,
  });

  const { data: siteDun = [], isLoading: isDunLoading } = useQuery({
    queryKey: ['site-dun', formState.parliament],
    queryFn: () => fetchDun(formState.parliament),
    enabled: !!formState.parliament,
  });

  const { data: siteMukim = [], isLoading: isMukimLoading } = useQuery({
    queryKey: ['site-Mukim', formState.district],
    queryFn: () => fetchMukim(formState.district),
    enabled: !!formState.district,
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
    if (formState.region === undefined) {
      setField('state', undefined);
      setField('district', undefined);
      setField('mukim', undefined);
      setField('parliament', undefined);
      setField('dun', undefined);
    } else {
      queryClient.invalidateQueries({ queryKey: ['site-state', formState.region] });
      setField('state', undefined);
      setField('district', undefined);
      setField('mukim', undefined);
      setField('parliament', undefined);
      setField('dun', undefined);
    }
  }, [formState.region, queryClient]);

  useEffect(() => {
    if (site && !isStateLoading && formState.region !== undefined) {
      setField('state', site.nd_site_address[0].state_id ?? undefined);
    }
  }, [isStateLoading, siteState, formState.region]);

  useEffect(() => {
    if (formState.state === undefined) {
      setField('district', undefined);
      setField('mukim', undefined);
      setField('parliament', undefined);
      setField('dun', undefined);
    } else {
      queryClient.invalidateQueries({ queryKey: ['site-district', formState.state] });
      queryClient.invalidateQueries({ queryKey: ['site-parliament', formState.state] });
      setField('district', undefined);
      setField('mukim', undefined);
      setField('parliament', undefined);
      setField('dun', undefined);

    }
  }, [formState.state, queryClient]);

  useEffect(() => {
    if (site && !isDistrictLoading && formState.state !== undefined) {
      setField('district', site.nd_site_address[0].district_id ?? undefined);
    }
  }, [isDistrictLoading, siteDistrict, formState.state]);

  useEffect(() => {
    if (site && !isParliamentLoading && formState.state !== undefined) {
      setField('parliament', site.nd_parliament?.id ?? undefined);
    }
  }, [isParliamentLoading, siteParliament, formState.state]);

  useEffect(() => {
    if (formState.district === undefined) {
      setField('mukim', undefined);
    } else {
      queryClient.invalidateQueries({ queryKey: ['site-mukim', formState.district] });
      setField('mukim', undefined);
    }
  }, [formState.district, queryClient]);

  useEffect(() => {
    if (site && !isMukimLoading && formState.district !== undefined) {
      setField('mukim', site.nd_mukim?.id ?? undefined);
    }
  }, [isMukimLoading, siteMukim, formState.district]);

  useEffect(() => {
    if (formState.parliament === undefined) {
      setField('dun', undefined);
    } else {
      queryClient.invalidateQueries({ queryKey: ['site-dun', formState.parliament] });
      setField('dun', undefined);
    }
  }, [formState.parliament, queryClient]);

  useEffect(() => {
    if (site && !isDunLoading && formState.parliament !== undefined) {
      setField('dun', site.nd_dun?.id);
    }
  }, [isDunLoading, siteDun, formState.parliament]);
  // Fetching dependent data based on selected value END

  //preset on 2nd value of status
  useEffect(() => {
    if (open && !site && !formState.status && siteStatus.length > 1 && !isStatusLoading) {
      setField('status', String(siteStatus[1].id)); // Set predefined status when the form is opened
    }
  }, [open, site, formState.status, siteStatus, isStatusLoading]);

  const resetForm = () => {
    setFormState({
      code: '',
      name: '',
      phase: undefined,
      region: undefined,
      parliament: undefined,
      dun: undefined,
      mukim: undefined,
      email: '',
      website: '',
      longitude: '',
      latitude: '',
      status: undefined,
      address: '',
      address2: '',
      district: undefined,
      city: '',
      postCode: '',
      state: undefined,
      technology: undefined,
      bandwidth: undefined,
      building_type: undefined,
      building_area: '',
      building_rental: undefined,
      zone: undefined,
      category_area: undefined,
      building_level: undefined,
      oku: undefined,
      coordinates: '',
      operate_date: '', // Add operate_date field
      socio_economic: [], // Add socio_economic field
      space: [], // Add space field
      dusp_tp_id: undefined, // Add dusp_tp_id field
    });
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (site) {
      // Populate form fields with site data for editing
      setFormState({
        code: site.nd_site[0].standard_code || '',
        name: site.sitename || '',
        phase: site.phase_id || undefined,
        region: site.region_id || undefined,
        parliament: site.nd_parliament?.id || undefined,
        dun: site.nd_dun?.id || undefined,
        mukim: site.nd_mukim?.id || undefined,
        email: site.email || '',
        website: site.website || '',
        longitude: site.longtitude || '',
        latitude: site.latitude || '',
        status: site.active_status || undefined,
        address: site.nd_site_address[0].address1 || '',
        address2: site.nd_site_address[0].address2 || '',
        city: site.nd_site_address[0].city || '',
        postCode: site.nd_site_address[0].postcode || '',
        district: site.nd_site_address[0].district_id || undefined,
        state: site.nd_site_address[0].state_id || undefined,
        technology: site.technology || undefined,
        bandwidth: site.bandwidth || undefined,
        building_type: site.building_type_id || undefined,
        building_area: site.building_area_id || '',
        building_rental: site.building_rental_id ?? undefined,
        zone: site.zone_id || undefined,
        category_area: site.area_id || undefined,
        building_level: site.level_id || undefined,
        oku: site.oku_friendly ?? undefined,
        coordinates: site.longtitude && site.latitude ? `${site.longtitude},${site.latitude}` : '',
        operate_date: site.operate_date ? site.operate_date.split('T')[0] : '', // Format timestamp to date
        socio_economic: site.nd_site_socioeconomic.map((s) => s.nd_socioeconomics.id) || [], // Populate socio_economic
        space: site.nd_site_space.map((s) => s.nd_space.id) || [], // Populate space
        dusp_tp_id: site.dusp_tp_id || undefined, // Populate dusp_tp_id
      });

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

    try {

      // Check if the site code already exists (case-insensitive)
      const { data: existingSite, error: codeCheckError } = await supabase
        .from('nd_site')
        .select('id, site_profile_id')
        .ilike('standard_code', formState.code);

      if (codeCheckError && codeCheckError.code !== 'PGRST116') throw codeCheckError; // Ignore "No rows found" error

      if (existingSite && existingSite.length > 0 && (!site || existingSite[0].site_profile_id !== site.id)) {
        const codeInput = document.getElementById('code');
        if (codeInput) {
          codeInput.focus();
        }
        throw new Error('Site code already exists');
      }
      
      // Check if coordinates are valid
      if (formState.coordinates) {
        const coordinates = formState.coordinates.split(',').map(coord => coord.trim());
        if (coordinates.length !== 2 || !coordinates[0] || !coordinates[1] || isNaN(Number(coordinates[0])) || isNaN(Number(coordinates[1]))) {
          const coorInput = document.getElementById('coordinates');
          if (coorInput) {
            coorInput.focus();
          }
          throw new Error('Invalid coordinate format. Please use "longitude, latitude" with valid numbers.');
        }
      }

      const site_profile = {
        sitename: formState.name || '',
        fullname: 'NADI' + (formState.name || ''),
        phase_id: formState.phase === '' ? null : formState.phase,
        region_id: formState.region === '' ? null : formState.region,
        parliament_rfid: formState.parliament === '' ? null : formState.parliament,
        dun_rfid: formState.dun === '' ? null : formState.dun,
        mukim_id: formState.mukim === '' ? null : formState.mukim,
        email: formState.email || '',
        website: formState.website || '',
        longtitude: formState.longitude ? parseFloat(formState.longitude) : null,
        latitude: formState.latitude ? parseFloat(formState.latitude) : null,
        state_id: formState.state === '' ? null : formState.state,
        active_status: formState.status === '' ? null : formState.status,
        technology: formState.technology === '' ? null : formState.technology,
        building_area_id: formState.building_area ? parseFloat(formState.building_area) : null,
        bandwidth: formState.bandwidth === '' ? null : formState.bandwidth,
        building_type_id: formState.building_type === '' ? null : formState.building_type,
        building_rental_id: formState.building_rental === undefined ? null : formState.building_rental,
        zone_id: formState.zone === '' ? null : formState.zone,
        area_id: formState.category_area === '' ? null : formState.category_area,
        level_id: formState.building_level === '' ? null : formState.building_level,
        oku_friendly: formState.oku ?? null,
        operate_date: formState.operate_date || null,
        dusp_tp_id: formState.dusp_tp_id === '' ? null : formState.dusp_tp_id, // Add dusp_tp_id to site_profile
        ...(site ? {} : organizationId ? { dusp_tp_id: organizationId } : {}), // Add dusp_tp_id only for creation and non-super_admin and TP group only
      };

      const site_address = {
        address1: formState.address || '',
        address2: formState.address2 || '',
        city: formState.city || '',
        postcode: formState.postCode || '',
        district_id: formState.district === '' ? null : formState.district,
        state_id: formState.state === '' ? null : formState.state,
        active_status: formState.status === '' ? null : formState.status,
      };

      const standard_code = formState.code;

      console.log(site_profile);
      console.log(site_address);

      if (site) {
        // Update existing site (exclude dusp_tp_id from updates)
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

        // Update socio-economic data
        const { error: deleteSocioError } = await supabase
          .from('nd_site_socioeconomic')
          .delete()
          .eq('site_id', site.id);

        if (deleteSocioError) throw deleteSocioError;

        const socioEconomicData = formState.socio_economic.map((id) => ({
          site_id: site.id,
          socioeconomic_id: id,
        }));

        const { error: insertSocioError } = await supabase
          .from('nd_site_socioeconomic')
          .insert(socioEconomicData);

        if (insertSocioError) throw insertSocioError;

        // Update space data
        const { error: deleteSpaceError } = await supabase
          .from('nd_site_space')
          .delete()
          .eq('site_id', site.id);

        if (deleteSpaceError) throw deleteSpaceError;

        const spaceData = formState.space.map((id) => ({
          site_id: site.id,
          space_id: id,
        }));

        const { error: insertSpaceError } = await supabase
          .from('nd_site_space')
          .insert(spaceData);

        if (insertSpaceError) throw insertSpaceError;

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

        // Create socio-economic data
        const socioEconomicData = formState.socio_economic.map((id) => ({
          site_id: site_id,
          socioeconomic_id: id,
        }));

        const { error: insertSocioError } = await supabase
          .from('nd_site_socioeconomic')
          .insert(socioEconomicData);

        if (insertSocioError) throw insertSocioError;

        // Create space data
        const spaceData = formState.space.map((id) => ({
          site_id: site_id,
          space_id: id,
        }));

        const { error: insertSpaceError } = await supabase
          .from('nd_site_space')
          .insert(spaceData);

        if (insertSpaceError) throw insertSpaceError;

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
        description: error.message || "Failed to add/update the site. Please try again.",
        variant: "destructive",
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  // Access control logic moved to the return statement
  if (parsedMetadata?.user_type !== "super_admin" && !organizationId) {
    return <div>You do not have access to create or edit sites.</div>;
  }

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
              {parsedMetadata?.user_type === "super_admin" && (
                <div className="space-y-2">
                  <Label htmlFor="dusp_tp_id">DUSP TP ID</Label>
                  <Select
                    name="dusp_tp_id"
                    value={formState.dusp_tp_id ?? undefined}
                    onValueChange={(value) => setField('dusp_tp_id', value)}
                    disabled={isOrganizationsLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={undefined} key="clearable-option">..</SelectItem> {/* Add clearable option */}
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={String(org.id)}>
                          {org.displayName} {/* Use displayName for dropdown */}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Site Name</Label>
                <Input id="name" name="name" value={formState.name} onChange={(e) => setField('name', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Site Code</Label>
                <Input id="code" name="code" value={formState.code} onChange={(e) => setField('code', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phase">Phase</Label>
                <Select name="phase" value={formState.phase ?? undefined} onValueChange={(value) => setField('phase', value)} disabled={isPhaseLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null} key="clearable-option">..</SelectItem> {/* Add clearable option */}
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
                <Input id="email" name="email" value={formState.email} type="email" onChange={(e) => setField('email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" value={formState.website} onChange={(e) => setField('website', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coordinates">Coordinates (Longitude, Latitude)</Label>
                <Input
                  id="coordinates"
                  name="coordinates"
                  placeholder="eg 3.2207, 101.439"
                  value={formState.coordinates ?? (formState.longitude ? formState.longitude + (formState.latitude ? ',' + formState.latitude : '') : '')}
                  onChange={(e) => setField('coordinates', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="technology">Internet Technology</Label>
                <Select name="technology" value={formState.technology ?? undefined} onValueChange={(value) => setField('technology', value)} disabled={isTechnologyLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select technology" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined} key="clearable-option">..</SelectItem>
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
                <Select name="bandwidth" value={formState.bandwidth ?? undefined} onValueChange={(value) => setField('bandwidth', value)} disabled={isBandwidthLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bandwidth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined} key="clearable-option">..</SelectItem>
                    {siteBandwidth.map((bandwidth) => (
                      <SelectItem key={bandwidth.id} value={String(bandwidth.id)}>
                        {bandwidth.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="building_type">Building type</Label>
                <Select name="building_type" value={formState.building_type ?? undefined} onValueChange={(value) => setField('building_type', value)} disabled={isBuildingTypeLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select building type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined} key="clearable-option">..</SelectItem>
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
                <Input id="building_area" name="building_area" type="number" placeholder="0" value={formState.building_area} onChange={(e) => setField('building_area', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="building_rental">Building rental</Label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="building_rental"
                      checked={formState.building_rental === true}
                      onChange={() => setField('building_rental', true)}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="building_rental"
                      checked={formState.building_rental === false}
                      onChange={() => setField('building_rental', false)}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone">Zone</Label>
                <Select name="zone" value={formState.zone ?? undefined} onValueChange={(value) => setField('zone', value)} disabled={isZoneLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined} key="clearable-option">..</SelectItem>
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
                <Select name="area" value={formState.category_area ?? undefined} onValueChange={(value) => setField('category_area', value)} disabled={isCategoryAreaLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined} key="clearable-option">..</SelectItem>
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
                <Select name="building_level" value={formState.building_level ?? undefined} onValueChange={(value) => setField('building_level', value)} disabled={isBuildingLevelLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select building level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined} key="clearable-option">..</SelectItem>
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
                      checked={formState.oku === true}
                      onChange={() => setField('oku', true)}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="oku"
                      checked={formState.oku === false}
                      onChange={() => setField('oku', false)}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="socio_economic">Socio-Economic</Label>
                <SelectMany
                  options={socioEconomicOptions.map((option) => ({
                    id: option.id,
                    label: option.eng,
                  }))}
                  value={formState.socio_economic}
                  onChange={(value) => setField("socio_economic", value)}
                  placeholder="Select socio-economic"
                  disabled={isSocioEconomicLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="space">Space</Label>
                <SelectMany
                  options={siteSpaceOptions.map((option) => ({
                    id: option.id,
                    label: option.eng,
                  }))}
                  value={formState.space}
                  onChange={(value) => setField("space", value)}
                  placeholder="Select space"
                  disabled={isSiteSpaceLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={formState.status ?? undefined} onValueChange={(value) => setField('status', value)} disabled={isStatusLoading}>
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
              <div className="space-y-2">
                <Label htmlFor="operate_date">Operate Date</Label>
                <DateInput
                  id="operate_date"
                  name="operate_date"
                  value={formState.operate_date}
                  onChange={(e) => setField('operate_date', e.target.value)}
                />
              </div>
            </div>
            <div className="border-l border-gray-300"></div>
            {/* Section 2 */}
            <div className="flex-1 space-y-4">
              <DialogTitle>Address Information</DialogTitle>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" value={formState.address} onChange={(e) => setField('address', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address2">Address 2 (Optional)</Label>
                <Textarea id="address2" name="address2" value={formState.address2} onChange={(e) => setField('address2', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formState.city} onChange={(e) => setField('city', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postCode">Postcode</Label>
                <Input id="postCode" name="postCode" value={formState.postCode} onChange={(e) => setField('postCode', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select name="region" value={formState.region ?? undefined} onValueChange={(value) => setField('region', value)} disabled={isRegionLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined} key="clearable-option">..</SelectItem> {/* Add clearable option */}
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
                <Select name="state" value={formState.state ?? ''} onValueChange={(value) => setField('state', value)} disabled={isStateLoading || !formState.region}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined} key="clearable-option">..</SelectItem> {/* Add clearable option */}
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
                <Select name="district" value={formState.district ?? ''} onValueChange={(value) => setField('district', value)} disabled={isDistrictLoading || !formState.state}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined} key="clearable-option">..</SelectItem> {/* Add clearable option */}
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
                <Select name="mukim" value={formState.mukim ?? ''} onValueChange={(value) => setField('mukim', value)} disabled={isMukimLoading || !formState.district}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mukim" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined} key="clearable-option">..</SelectItem> {/* Add clearable option */}
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
                <Select name="parliament" value={formState.parliament ?? ''} onValueChange={(value) => setField('parliament', value)} disabled={isParliamentLoading || !formState.state}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parliament" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined} key="clearable-option">..</SelectItem> {/* Add clearable option */}
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
                <Select name="dun" value={formState.dun ?? ''} onValueChange={(value) => setField('dun', value)} disabled={isDunLoading || !formState.parliament}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined} key="clearable-option">..</SelectItem> {/* Add clearable option */}
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