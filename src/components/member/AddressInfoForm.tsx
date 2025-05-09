import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useGeoData from "@/hooks/use-geo-data";

const AddressInfoForm = ({ formData, setFormData, goToNextTab, goToPreviousTab}) => {
  const { districts, states } = useGeoData(); // Fetch districts and states from the hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Address Information</CardTitle>
        <CardDescription>
          Enter address and additional contact details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address Line 1 */}
        <div className="space-y-2">
          <Label htmlFor="address1" className="flex items-center">
            Address Line 1 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="address1"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            required
          />
        </div>

        {/* Address Line 2 */}
        <div className="space-y-2">
          <Label htmlFor="address2" className="flex items-center">
            Address Line 2
          </Label>
          <Input
            id="address2"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
          />
        </div>

        {/* State */}
        <div className="space-y-2">
          <Label htmlFor="state_id" className="flex items-center">
            State <span className="text-red-500 ml-1">*</span>
          </Label>
          <h1>

          </h1>
          <Select
            name="state_id"
            value={formData.state_id || ""}
            onValueChange={(value) => setFormData({ ...formData, state_id: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
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

        {/* District */}
        <div className="space-y-2">
          <Label htmlFor="district_id" className="flex items-center">
            District <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            name="district_id"
            value={formData.district_id || ""}
            onValueChange={(value) => setFormData({ ...formData, district_id: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select district" />
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

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city" className="flex items-center">
            City <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        {/* Postcode */}
        <div className="space-y-2">
          <Label htmlFor="postcode" className="flex items-center">
            Postcode <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            required
          />
        </div>

        {/* Distance */}
        <div className="space-y-2">
          <Label htmlFor="distance" className="flex items-center">
            Distance from NADI (km)
          </Label>
          <Input
            id="distance"
            name="distance"
            type="number"
            value={formData.distance}
            onChange={handleChange}
          />
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button type="button" variant="outline" onClick={goToPreviousTab}>
          Previous
        </Button>
        <Button type="button" onClick={goToNextTab}>
          Next Step
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddressInfoForm;