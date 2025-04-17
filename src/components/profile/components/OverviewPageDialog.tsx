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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ProfileEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profileData: any;
    userGroup: number;
    onSave: (updatedData: any) => void;
}

const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
    open,
    onOpenChange,
    profileData,
    userGroup,
    onSave,
}) => {
    const { toast } = useToast();
    const [formState, setFormState] = useState<any>({});

    useEffect(() => {
        if (open) {
            setFormState(profileData || {});
        }
    }, [open, profileData]);

    const setField = (field: string, value: any) => {
        setFormState((prevState) => ({ ...prevState, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave(formState);
        toast({
            title: "Success",
            description: "Profile updated successfully.",
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>Update your profile details below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(userGroup === 1 || userGroup === 2 || userGroup === 3 || userGroup === 4 || userGroup === 5 || userGroup === 6 || userGroup === 7) && (
                            <div>
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input
                                    id="fullname"
                                    value={formState.fullname || ""}
                                    onChange={(e) => setField("fullname", e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        {(userGroup === 1 || userGroup === 2 || userGroup === 3 || userGroup === 4 || userGroup === 5 || userGroup === 6) && (
                            <div>
                                <Label htmlFor="ic_no">IC Number</Label>
                                <Input
                                    id="ic_no"
                                    value={formState.ic_no || ""}
                                    onChange={(e) => setField("ic_no", e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="identity_no">IC Number</Label>
                                <Input
                                    id="identity_no"
                                    value={formState.identity_no || ""}
                                    onChange={(e) => setField("identity_no", e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        {(userGroup === 1 || userGroup === 2 || userGroup === 3 || userGroup === 4 || userGroup === 5 || userGroup === 6 || userGroup === 7) && (
                            <div>
                                <Label htmlFor="mobile_no">Mobile Number</Label>
                                <Input
                                    id="mobile_no"
                                    type="tel"
                                    value={formState.mobile_no || ""}
                                    onChange={(e) => setField("mobile_no", e.target.value)}
                                />
                            </div>
                        )}
                        {(userGroup === 1 || userGroup === 2 || userGroup === 3 || userGroup === 4 || userGroup === 5 || userGroup === 6) && (
                            <div>
                                <Label htmlFor="work_email">Work Email</Label>
                                <Input
                                    id="work_email"
                                    type="email"
                                    value={formState.work_email || ""}
                                    onChange={(e) => setField("work_email", e.target.value)}
                                />
                            </div>
                        )}
                        {(userGroup === 3 || userGroup === 6) && (
                            <div>
                                <Label htmlFor="personal_email">Personal Email</Label>
                                <Input
                                    id="personal_email"
                                    type="email"
                                    value={formState.personal_email || ""}
                                    onChange={(e) => setField("personal_email", e.target.value)}
                                />
                            </div>
                        )}

                        {(userGroup === 3 || userGroup === 6 || userGroup === 7) && (
                            <div>
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={formState.dob || ""}
                                    onChange={(e) => setField("dob", e.target.value)}
                                />
                            </div>
                        )}
                        {(userGroup === 3 || userGroup === 6) && (
                            <div>
                                <Label htmlFor="place_of_birth">Place of Birth</Label>
                                <Input
                                    id="place_of_birth"
                                    value={formState.place_of_birth || ""}
                                    onChange={(e) => setField("place_of_birth", e.target.value)}
                                />
                            </div>
                        )}
                        {(userGroup === 3 || userGroup === 6) && (
                            <div>
                                <Label htmlFor="marital_status">Marital Status</Label>
                                <Input
                                    id="marital_status"
                                    value={formState.marital_status?.eng || ""}
                                    onChange={(e) => setField("marital_status", { eng: e.target.value })}
                                />
                            </div>
                        )}
                        {(userGroup === 3 || userGroup === 6 || userGroup === 7) && (
                            <div>
                                <Label htmlFor="race">Race</Label>
                                <Input
                                    id="race"
                                    value={formState.race_id?.eng || ""}
                                    onChange={(e) => setField("race_id", { eng: e.target.value })}
                                />
                            </div>
                        )}
                        {(userGroup === 3 || userGroup === 6) && (
                            <div>
                                <Label htmlFor="religion">Religion</Label>
                                <Input
                                    id="religion"
                                    value={formState.religion_id?.eng || ""}
                                    onChange={(e) => setField("religion_id", { eng: e.target.value })}
                                />
                            </div>
                        )}
                        {(userGroup === 3 || userGroup === 6) && (
                            <div>
                                <Label htmlFor="nationality">Nationality</Label>
                                <Input
                                    id="nationality"
                                    type="text"
                                    value={formState.nationality || ""}
                                    onChange={(e) => setField("nationality", e.target.value)}
                                />
                            </div>
                        )}
                        {userGroup === 6 && (
                            <div>
                                <Label htmlFor="gender">Gender</Label>
                                <Input
                                    id="gender"
                                    value={formState.gender_id?.eng || ""}
                                    onChange={(e) => setField("gender_id", { eng: e.target.value })}
                                />
                            </div>
                        )}
                        {(userGroup === 1 || userGroup === 2 || userGroup === 3 || userGroup === 4 || userGroup === 5 || userGroup === 6) && (
                            <div>
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    type="text"
                                    value={formState.position || ""}
                                    onChange={(e) => setField("position", e.target.value)}
                                />
                            </div>
                        )}
                        {(userGroup === 3 || userGroup === 6) && (
                            <div>
                                <Label htmlFor="qualification">Qualification</Label>
                                <Input
                                    id="qualification"
                                    type="text"
                                    value={formState.qualification || ""}
                                    onChange={(e) => setField("qualification", e.target.value)}
                                />
                            </div>
                        )}
                        {(userGroup === 1 || userGroup === 2 || userGroup === 3 || userGroup === 4 || userGroup === 5 || userGroup === 6) && (
                            <div>
                                <Label htmlFor="is_active">Account Status</Label>
                                <Input
                                    id="is_active"
                                    type="text"
                                    value={
                                        formState.is_active !== null && formState.is_active !== undefined
                                            ? formState.is_active
                                                ? "Active"
                                                : "Inactive"
                                            : "N/A"
                                    }
                                    onChange={(e) =>
                                        setField("is_active", e.target.value.toLowerCase() === "active")
                                    }
                                />
                            </div>
                        )}

                        {userGroup === 5 && (
                            <div>
                                <Label htmlFor="registration_number">Registration Number</Label>
                                <Input
                                    id="registration_number"
                                    type="text"
                                    value={formState.registration_number || ""}
                                    onChange={(e) => setField("registration_number", e.target.value)}
                                />
                            </div>
                        )}

                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="ref_id">NADI Site</Label>
                                <Input
                                    id="ref_id"
                                    type="text"
                                    value={formState.ref_id?.sitename || ""}
                                    onChange={(e) =>
                                        setField("ref_id", { ...(formState.ref_id || {}), sitename: e.target.value })
                                    }
                                />
                            </div>
                        )}
                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="type_membership">Type Membership</Label>
                                <Input
                                    id="type_membership"
                                    type="text"
                                    value={formState.type_membership || ""}
                                    onChange={(e) => setField("type_membership", e.target.value)}
                                />
                            </div>
                        )}

                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="community_status">Community Status</Label>
                                <Input
                                    id="community_status"
                                    type="text"
                                    value={
                                        formState.community_status === true
                                            ? "Active"
                                            : formState.community_status === false
                                                ? "Inactive"
                                                : "N/A"
                                    }
                                    onChange={(e) =>
                                        setField("community_status", e.target.value.toLowerCase() === "active")
                                    }
                                />
                            </div>
                        )}

                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    value={formState.age || ""}
                                    onChange={(e) => setField("age", e.target.value)}
                                />
                            </div>
                        )}

                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formState.email || ""}
                                    onChange={(e) => setField("email", e.target.value)}
                                />
                            </div>
                        )}

                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="gender">Gender</Label>
                                <Input
                                    id="gender"
                                    type="text"
                                    value={formState.gender?.eng || ""}
                                    onChange={(e) =>
                                        setField("gender", { ...(formState.gender || {}), eng: e.target.value })
                                    }
                                />
                            </div>
                        )}
                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="ethnic_id">Ethnic</Label>
                                <Input
                                    id="ethnic_id"
                                    type="text"
                                    value={formState.ethnic_id || ""}
                                    onChange={(e) => setField("ethnic_id", e.target.value)}
                                />
                            </div>
                        )}

                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="occupation_id">Occupation</Label>
                                <Input
                                    id="occupation_id"
                                    type="text"
                                    value={formState.occupation_id?.eng || ""}
                                    onChange={(e) =>
                                        setField("occupation_id", { ...(formState.occupation_id || {}), eng: e.target.value })
                                    }
                                />
                            </div>
                        )}

                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="type_sector">Type Sector</Label>
                                <Input
                                    id="type_sector"
                                    type="text"
                                    value={formState.type_sector?.eng || ""}
                                    onChange={(e) =>
                                        setField("type_sector", { ...(formState.type_sector || {}), eng: e.target.value })
                                    }
                                />
                            </div>
                        )}

                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="socio_id">Socioeconomic</Label>
                                <Input
                                    id="socio_id"
                                    type="text"
                                    value={formState.socio_id?.eng || ""}
                                    onChange={(e) =>
                                        setField("socio_id", { ...(formState.socio_id || {}), eng: e.target.value })
                                    }
                                />
                            </div>
                        )}

                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="ict_knowledge">ICT Knowledge</Label>
                                <Input
                                    id="ict_knowledge"
                                    type="text"
                                    value={formState.ict_knowledge?.eng || ""}
                                    onChange={(e) =>
                                        setField("ict_knowledge", { ...(formState.ict_knowledge || {}), eng: e.target.value })
                                    }
                                />
                            </div>
                        )}

                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="education_level">Education Level</Label>
                                <Input
                                    id="education_level"
                                    type="text"
                                    value={formState.education_level?.eng || ""}
                                    onChange={(e) =>
                                        setField("education_level", { ...(formState.education_level || {}), eng: e.target.value })
                                    }
                                />
                            </div>
                        )}

                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="oku_status">OKU Status</Label>
                                <Input
                                    id="oku_status"
                                    type="text"
                                    value={
                                        formState.oku_status === true
                                            ? "Yes"
                                            : formState.oku_status === false
                                                ? "No"
                                                : "N/A"
                                    }
                                    onChange={(e) =>
                                        setField("oku_status", e.target.value.toLowerCase() === "yes")
                                    }
                                />
                            </div>
                        )}

                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="income_range">Income Range</Label>
                                <Input
                                    id="income_range"
                                    type="text"
                                    value={formState.income_range?.eng || ""}
                                    onChange={(e) =>
                                        setField("income_range", { ...(formState.income_range || {}), eng: e.target.value })
                                    }
                                />
                            </div>
                        )}

                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="distance">Distance</Label>
                                <Input
                                    id="distance"
                                    type="number"
                                    value={formState.distance || ""}
                                    onChange={(e) => setField("distance", e.target.value)}
                                />
                            </div>
                        )}
                        {(userGroup === 1 || userGroup === 3 || userGroup === 4 || userGroup === 7) && (
                            <div>
                                <Label htmlFor="join_date">Join Date</Label>
                                <Input
                                    id="join_date"
                                    type="date"
                                    value={formState.join_date || ""}
                                    onChange={(e) => setField("join_date", e.target.value)}
                                />
                            </div>
                        )}

                        {(userGroup === 1 || userGroup === 3 || userGroup === 4) && (
                            <div>
                                <Label htmlFor="resign_date">Resign Date</Label>
                                <Input
                                    id="resign_date"
                                    type="date"
                                    value={formState.resign_date || ""}
                                    onChange={(e) => setField("resign_date", e.target.value)}
                                />
                            </div>
                        )}

                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="status_membership">Status Membership</Label>
                                <Input
                                    id="status_membership"
                                    type="text"
                                    value={
                                        formState.status_membership === true
                                            ? "Active"
                                            : formState.status_membership === false
                                                ? "Inactive"
                                                : "N/A"
                                    }
                                    onChange={(e) =>
                                        setField("status_membership", e.target.value.toLowerCase() === "active")
                                    }
                                />
                            </div>
                        )}

                        {userGroup === 7 && (
                            <div>
                                <Label htmlFor="status_entrepreneur">Status Entrepreneur</Label>
                                <Input
                                    id="status_entrepreneur"
                                    type="text"
                                    value={
                                        formState.status_entrepreneur === true
                                            ? "Active"
                                            : formState.status_entrepreneur === false
                                                ? "Inactive"
                                                : "N/A"
                                    }
                                    onChange={(e) =>
                                        setField("status_entrepreneur", e.target.value.toLowerCase() === "active")
                                    }
                                />
                            </div>
                        )}

                        {userGroup === 3 && (
                            <div>
                                <Label htmlFor="tech_partner_id">Tech Partner</Label>
                                <Input
                                    id="tech_partner_id"
                                    type="text"
                                    value={formState.tech_partner_id?.name || ""}
                                    onChange={(e) =>
                                        setField("tech_partner_id", { ...(formState.tech_partner_id || {}), name: e.target.value })
                                    }
                                />
                            </div>
                        )}

                        {userGroup === 1 && (
                            <div>
                                <Label htmlFor="dusp_id">DUSP</Label>
                                <Input
                                    id="dusp_id"
                                    type="text"
                                    value={formState.dusp_id?.name || ""}
                                    onChange={(e) =>
                                        setField("dusp_id", { ...(formState.dusp_id || {}), name: e.target.value })
                                    }
                                />
                            </div>
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

export default ProfileEditDialog;