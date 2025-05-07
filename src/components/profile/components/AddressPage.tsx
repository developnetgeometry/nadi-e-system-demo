import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import React, { useState } from "react";
import AddressPageDialogMember from "./AddressPageDialogMember";

const ProfileAddressPage = ({
  addressData,
  memberId,
  refetch,
}: {
  addressData: any;
  memberId: string;
  refetch: () => void;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (updatedData: any) => {
    console.log("Updated address data:", updatedData);
    refetch(); // Refetch the data after saving
    setIsDialogOpen(false); // Close the dialog after saving
  };

  if (!addressData) {
    return (
      <div className="text-center text-gray-500">
        No address information available.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-left">Address Details</h3>
        <Button
          variant="ghost"
          className="text-primary flex items-center gap-1 justify-end"
          onClick={() => setIsDialogOpen(true)} // Open the dialog
        >
          <Edit size={16} /> Edit address details
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AddressPageDialogMember */}
        <AddressPageDialogMember
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          addressData={addressData}
          memberId={memberId}
          onSave={handleSave}
        />

        <div className="col-span-2">
          <p className="text-sm text-gray-500">Address Line 1:</p>
          <p className="text-base font-medium">{addressData.address1 ?? "N/A"}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-gray-500">Address Line 2:</p>
          <p className="text-base font-medium">{addressData.address2 ?? "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">City:</p>
          <p className="text-base font-medium">{addressData.city ?? "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Postcode:</p>
          <p className="text-base font-medium">{addressData.postcode ?? "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">District:</p>
          <p className="text-base font-medium">{addressData.district_id?.name ?? "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">State:</p>
          <p className="text-base font-medium">{addressData.state_id?.name ?? "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileAddressPage;