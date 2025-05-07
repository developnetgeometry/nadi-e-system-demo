import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateMemberAddress } from "@/components/profile/hook/use-member-profile";
import { useToast } from "@/hooks/use-toast";
import useGeoData from "@/pages/dashboard/members/hook/use-geo-data-simple";

interface AddressPageDialogMemberProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addressData: any;
  memberId: string;
  onSave: (updatedData: any) => void;
}

const AddressPageDialogMember: React.FC<AddressPageDialogMemberProps> = ({
  open,
  onOpenChange,
  addressData,
  memberId,
  onSave,
}) => {
  const { toast } = useToast();
  const [formState, setFormState] = useState<any>({});
  const { states, districts, fetchDistrictsByState } = useGeoData();

  useEffect(() => {
    if (open) {
      setFormState({
        ...addressData,
        state_id: addressData?.state_id?.id?.toString() || "", // Extract state_id as a string
        district_id: addressData?.district_id?.id?.toString() || "", // Extract district_id as a string
      });
    }
  }, [open, addressData]);

  useEffect(() => {
    if (formState.state_id) {
      fetchDistrictsByState(formState.state_id); // Fetch districts when state_id changes
    }
  }, [formState.state_id, fetchDistrictsByState]);

  const setField = (field: string, value: any) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Call the updateMemberAddress function with the updated formState
      await updateMemberAddress(memberId, {
        address1: formState.address1,
        address2: formState.address2,
        city: formState.city,
        postcode: formState.postcode,
        state_id: formState.state_id,
        district_id: formState.district_id,
      });

      toast({
        title: "Success",
        description: "Address updated successfully.",
      });

      // Call the onSave callback to update the parent component
      onSave(formState);

      // Close the dialog
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update address.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
          <DialogDescription>Update your address details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <Label htmlFor="address1">Address Line 1</Label>
              <Input
                id="address1"
                value={formState.address1 || ""}
                onChange={(e) => setField("address1", e.target.value)}
                required
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="address2">Address Line 2</Label>
              <Input
                id="address2"
                value={formState.address2 || ""}
                onChange={(e) => setField("address2", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="state_id">State</Label>
              <Select
                value={formState.state_id || ""}
                onValueChange={(value) => {
                  setField("state_id", value);
                  setField("district_id", null); // Reset district when state changes
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state">
                    {states.find((state) => state.id.toString() === formState.state_id)?.name || "Select state"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="district_id">District</Label>
              <Select
                value={formState.district_id || ""}
                onValueChange={(value) => setField("district_id", value)}
                disabled={!formState.state_id}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select district">
                    {districts.find((district) => district.id.toString() === formState.district_id)?.name || "Select district"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.id.toString()}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formState.city || ""}
                onChange={(e) => setField("city", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="postcode">Postcode</Label>
              <Input
                id="postcode"
                value={formState.postcode || ""}
                onChange={(e) => setField("postcode", e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressPageDialogMember;