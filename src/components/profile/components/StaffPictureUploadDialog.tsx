import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from '../../ui/file-upload';
import useProfilePictureUpload from '../hook/use-profile-picture-staff-upload';

interface ProfilePictureUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFilesSelected: (files: File[]) => void;
}

const ProfilePictureUploadDialog: React.FC<ProfilePictureUploadDialogProps> = ({ open, onOpenChange, onFilesSelected }) => {
    const { uploadProfilePicture, isLoading, error } = useProfilePictureUpload();

    const handleFilesSelected = async (files: File[]) => {
        if (files.length > 0) {
            try {
                const profilePictureUrl = await uploadProfilePicture(files[0]);
                onFilesSelected([files[0]]);
                console.log('Profile picture uploaded:', profilePictureUrl);
            } catch (err) {
                console.error('Error uploading profile picture:', err);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Profile Picture</DialogTitle>
                    <DialogDescription>Select a file to upload as your profile picture.</DialogDescription>
                </DialogHeader>
                <FileUpload
                    maxFiles={1}
                    acceptedFileTypes=".jpg,.png"
                    maxSizeInMB={2}
                    buttonText="Choose File"
                    onFilesSelected={handleFilesSelected}
                />
                {isLoading && <p>Uploading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ProfilePictureUploadDialog;