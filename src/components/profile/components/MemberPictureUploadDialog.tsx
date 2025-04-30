import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from '../../ui/file-upload';
import useProfilePictureUpload from '../hook/use-profile-picture-member-upload';

interface ProfilePictureUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFilesSelected: (files: File[]) => void;
    memberId: string; // Add memberId prop
    userId: string; // Add userId prop
  }
  
  const ProfilePictureUploadDialog: React.FC<ProfilePictureUploadDialogProps> = ({
    open,
    onOpenChange,
    onFilesSelected,
    memberId,
    userId,
  }) => {
    const { uploadProfilePicture, isLoading, error } = useProfilePictureUpload(memberId, userId); // Pass memberId and userId
  
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