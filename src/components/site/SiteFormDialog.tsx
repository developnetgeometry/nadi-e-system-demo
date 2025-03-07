//FORM STILL NOT COMPLETE
// TODO DUSP_TP
// 

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { fetchSiteStatus, fetchPhase, fetchRegion, fetchDistrict, fetchParliament, fetchMukim, fetchState, fetchDun } from "@/components/site/component/site-utils";
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

  // Fetching START lookup data
  const { data: siteStatus = [], isLoading: isStatusLoading } = useQuery({
    queryKey: ['site-status'],
    queryFn: ()=>fetchSiteStatus(),
  });
  const { data: sitePhase = [], isLoading: isPhaseLoading } = useQuery({
    queryKey: ['site-phase'],
    queryFn: ()=>fetchPhase(),
  });
  const { data: siteRegion = [], isLoading: isRegionLoading } = useQuery({
    queryKey: ['site-region'],
    queryFn: ()=>fetchRegion(),
  });
  const { data: siteDistrict = [], isLoading: isDistrictLoading } = useQuery({
    queryKey: ['site-district'],
    queryFn: ()=>fetchDistrict(),
  });
  const { data: siteParliament = [], isLoading: isParliamentLoading } = useQuery({
    queryKey: ['site-parliament'],
    queryFn: ()=>fetchParliament(),
  });
  const { data: siteDun = [], isLoading: isDunLoading } = useQuery({
    queryKey: ['site-dun'],
    queryFn: ()=>fetchDun(),
  });
  const { data: siteMukim = [], isLoading: isMukimLoading } = useQuery({
    queryKey: ['site-Mukim'],
    queryFn: ()=>fetchMukim(),
  });
  const { data: siteState = [], isLoading: isStateLoading } = useQuery({
    queryKey: ['site-State'],
    queryFn: ()=>fetchState(),
  });
  // Fetching END lookup data

  useEffect(() => {
    if (siteStatus.length > 1 && !status) {
      setStatus(String(siteStatus[1].id));
    }
  }, [siteStatus, status]);

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
      console.log('code:', standard_code);
      const {error: codeError } = await supabase
        .from('nd_site')
        .insert([{standard_code:standard_code,site_profile_id:site_id}])
        .select('id');

      if (codeError) throw codeError;

      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['site-stats'] });
      queryClient.invalidateQueries({ queryKey: ['sites'] });

      // Reset form fields
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
      //setStatus(null);
      setAddress('');
      setAddress2('');
      setCity('');
      setPostCode('');
      setDistrict(null);
      setState(null);

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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
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
                    {sitePhase.map((phase) => (
                      <SelectItem key={phase.id} value={String(phase.id)}>
                        {phase.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select name="region" value={region ?? undefined} onValueChange={setRegion} disabled={isRegionLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteRegion.map((region) => (
                      <SelectItem key={region.id} value={String(region.id)}>
                        {region.eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div><div className="space-y-2">
                <Label htmlFor="parliament">Parliament</Label>
                <Select name="parliament" value={parliament ?? undefined} onValueChange={setParliament} disabled={isParliamentLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parliament" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteParliament.map((parliament) => (
                      <SelectItem key={parliament.id} value={String(parliament.id)}>
                        {parliament.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dun">Dun</Label>
                <Select name="dun" value={dun ?? undefined} onValueChange={setDun} disabled={isDunLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dun" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteDun.map((dun) => (
                      <SelectItem key={dun.id} value={String(dun.id)}>
                        {dun.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mukim">Mukim</Label>
                <Select name="mukim" value={mukim ?? undefined} onValueChange={setMukim} disabled={isMukimLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mukim" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteMukim.map((mukim) => (
                      <SelectItem key={mukim.id} value={String(mukim.id)}>
                        {mukim.name}
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
                <Label htmlFor="district">District</Label>
                <Select name="district" value={district ?? undefined} onValueChange={setDistrict} disabled={isDistrictLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteDistrict.map((district) => (
                      <SelectItem key={district.id} value={String(district.id)}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select name="state" value={state ?? undefined} onValueChange={setState} disabled={isStateLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteState.map((state) => (
                      <SelectItem key={state.id} value={String(state.id)}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
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