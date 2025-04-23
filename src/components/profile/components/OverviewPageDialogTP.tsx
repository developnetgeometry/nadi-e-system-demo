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
import { useToast } from "@/hooks/use-toast";
import useGeneralData from "@/hooks/use-general-data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateTPProfile } from "@/components/profile/hook/use-tp-profile";
import { useUserMetadata } from "@/hooks/use-user-metadata";

interface ProfileEditDialogTPProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profileData: any;
    onSave: (updatedData: any) => void;
}

const ProfileEditDialogTP: React.FC<ProfileEditDialogTPProps> = ({
    open,
    onOpenChange,
    profileData,
    onSave,
}) => {
    const { toast } = useToast();
    const { positions, maritalStatuses, races, religions, nationalities } = useGeneralData();
    const [formState, setFormState] = useState<any>({});
    const userMetadata = useUserMetadata();
    const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
    const userGroup = parsedMetadata?.user_group;
    const userType = parsedMetadata?.user_type;

    useEffect(() => {
        if (open) {
            setFormState(profileData || {});
        }
    }, [open, profileData, userGroup, userType]);

    const setField = (field: string, value: any) => {
        setFormState((prevState) => ({ ...prevState, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Call the updateTPProfile function with the updated formState
            await updateTPProfile({
                user_id: formState.user_id, // Pass the unique user_id
                fullname: formState.fullname,
                ic_no: formState.ic_no,
                mobile_no: formState.mobile_no,
                work_email: formState.work_email,
                personal_email: formState.personal_email,
                position_id: formState.position_id?.id, // Pass the position_id as id
                dob: formState.dob,
                place_of_birth: formState.place_of_birth,
                marital_status: formState.marital_status?.id,
                race_id: formState.race_id?.id,
                religion_id: formState.religion_id?.id,
                nationality_id: formState.nationality_id?.id,
                qualification: formState.qualification,
                is_active: formState.is_active,
                join_date: formState.join_date,
                resign_date: formState.resign_date,
            });

            toast({
                title: "Success",
                description: "Profile updated successfully.",
            });

            // Call the onSave callback to update the parent component
            onSave(formState);

            // Close the dialog
            onOpenChange(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update profile.",
                variant: "destructive",
            });
        }
    };

    if (!userGroup) {
        return "Loading data...";
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Profile TP</DialogTitle>
                    <DialogDescription>Update your profile details below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userType === "super_admin" && (
                            <>
                                <div>
                                    <Label htmlFor="fullname">Full Name</Label>
                                    <Input
                                        id="fullname"
                                        value={formState.fullname || ""}
                                        onChange={(e) => setField("fullname", e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="ic_no">IC Number</Label>
                                    <Input
                                        id="ic_no"
                                        value={formState.ic_no || ""}
                                        onChange={(e) => setField("ic_no", e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}
                        {(userType === "super_admin" || userGroup === 3) && (
                            <>
                                <div>
                                    <Label htmlFor="mobile_no">Mobile Number</Label>
                                    <Input
                                        id="mobile_no"
                                        type="tel"
                                        value={formState.mobile_no || ""}
                                        onChange={(e) => setField("mobile_no", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="personal_email">Work Email</Label>
                                    <Input
                                        id="personal_email"
                                        type="email"
                                        value={formState.personal_email || ""}
                                        onChange={(e) => setField("personal_email", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="place_of_birth">Place Of Birth</Label>
                                    <Input
                                        id="place_of_birth"
                                        value={formState.place_of_birth || ""}
                                        onChange={(e) => setField("place_of_birth", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="marital_status">Marital Status</Label>
                                    <Select
                                        name="marital_status"
                                        value={formState.marital_status?.id?.toString() || ""}
                                        onValueChange={(value) =>
                                            setField(
                                                "marital_status",
                                                maritalStatuses.find((status) => status.id.toString() === value)
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select marital status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {maritalStatuses.map((status) => (
                                                <SelectItem key={status.id} value={status.id.toString()}>
                                                    {status.eng}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="qualification">Qualification</Label>
                                    <Input
                                        id="qualification"
                                        value={formState.qualification || ""}
                                        onChange={(e) => setField("qualification", e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}
                        {userType === "super_admin" && (
                            <>
                                <div>
                                    <Label htmlFor="work_email">Work Email</Label>
                                    <Input
                                        id="work_email"
                                        type="email"
                                        value={formState.work_email || ""}
                                        onChange={(e) => setField("work_email", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="dob">Join Date</Label>
                                    <Input
                                        id="dob"
                                        type="date"
                                        value={formState.join_date || ""}
                                        onChange={(e) => setField("dob", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="position_id">Position</Label>
                                    <Select
                                        name="position_id"
                                        value={formState.position_id?.id?.toString() || ""} // Map to position_id.id
                                        onValueChange={(value) =>
                                            setField("position_id", positions.find((position) => position.id.toString() === value))
                                        } // Find the full position object by id
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select position" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {positions.map((position) => (
                                                <SelectItem key={position.id} value={position.id.toString()}>
                                                    {position.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* Race */}
                                <div>
                                    <Label htmlFor="race_id">Race</Label>
                                    <Select
                                        name="race_id"
                                        value={formState.race_id?.id?.toString() || ""}
                                        onValueChange={(value) =>
                                            setField("race_id", races.find((race) => race.id.toString() === value))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select race" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {races.map((race) => (
                                                <SelectItem key={race.id} value={race.id.toString()}>
                                                    {race.eng}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Religion */}
                                <div>
                                    <Label htmlFor="religion_id">Religion</Label>
                                    <Select
                                        name="religion_id"
                                        value={formState.religion_id?.id?.toString() || ""}
                                        onValueChange={(value) =>
                                            setField("religion_id", religions.find((religion) => religion.id.toString() === value))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select religion" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {religions.map((religion) => (
                                                <SelectItem key={religion.id} value={religion.id.toString()}>
                                                    {religion.eng}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Nationality */}
                                <div>
                                    <Label htmlFor="nationality_id">Nationality</Label>
                                    <Select
                                        name="nationality_id"
                                        value={formState.nationality_id?.id?.toString() || ""}
                                        onValueChange={(value) =>
                                            setField(
                                                "nationality_id",
                                                nationalities.find((nationality) => nationality.id.toString() === value)
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select nationality" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {nationalities.map((nationality) => (
                                                <SelectItem key={nationality.id} value={nationality.id.toString()}>
                                                    {nationality.eng}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="is_active">Account Status</Label>
                                    <RadioGroup
                                        value={formState.is_active?.toString() || "false"} // Map boolean to string for RadioGroup
                                        onValueChange={(value) => setField("is_active", value === "true")} // Convert string back to boolean
                                    >
                                        <div className="flex items-center space-x-4 mt-3">
                                            <RadioGroupItem value="true" id="active" />
                                            <Label htmlFor="active">Active</Label>
                                            <RadioGroupItem value="false" id="inactive" />
                                            <Label htmlFor="inactive">Inactive</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div>
                                    <Label htmlFor="join_date">Join Date</Label>
                                    <Input
                                        id="join_date"
                                        type="date"
                                        value={formState.join_date || ""}
                                        onChange={(e) => setField("join_date", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="resign_date">Resign Date</Label>
                                    <Input
                                        id="resign_date"
                                        type="date"
                                        value={formState.resign_date || ""}
                                        onChange={(e) => setField("resign_date", e.target.value)}
                                    />
                                </div>
                            </>
                        )}
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

export default ProfileEditDialogTP;