import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useSiteProfiles } from "@/components/member/hook/useSiteProfile";
import {
  useGetSiteAgreementById,
  useCreateSiteAgreement,
  useUpdateSiteAgreement
} from "@/hooks/site-agreement/use-agreement";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, FileIcon } from "lucide-react";

interface FormData {
  site_profile_id: number | undefined;
  remark: string;
}

const AgreementForm = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  // File upload state
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [fileError, setFileError] = useState<string>("");

  // Fetch site profiles for dropdown
  const { profiles = [], loading: isLoadingProfiles } = useSiteProfiles();

  // Agreement hooks
  const { data: agreementData, isLoading: isLoadingAgreement } = useGetSiteAgreementById(
    isEdit ? parseInt(id!) : 0
  );
  const createMutation = useCreateSiteAgreement();
  const updateMutation = useUpdateSiteAgreement();
  
  const form = useForm<FormData>({
    defaultValues: {
      site_profile_id: undefined as any,
      remark: "",
    },
  });


  // Reset form with agreement data when available and profiles are loaded
  useEffect(() => {
    if (isEdit && agreementData && !isLoadingProfiles && profiles.length > 0) {
      const siteProfileId = agreementData.site_profile_id?.id;

      // Verify the profile exists in the loaded profiles
      const profileExists = siteProfileId ? profiles.find(p => p.id === siteProfileId) : null;
      form.reset({
        site_profile_id: profileExists ? siteProfileId : undefined as any,
        remark: agreementData.remark || "",
      });

      // Set uploaded files from existing data
      if (agreementData.file_path && Array.isArray(agreementData.file_path)) {
        setUploadedFiles(agreementData.file_path);
      }
    }
  }, [isEdit, agreementData, form, isLoadingProfiles, profiles]);
  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
    // Clear file error when files are selected
    if (selectedFiles.length > 0) {
      setFileError("");
    }
  };

  // Remove file from selection
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Remove uploaded file
  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };  
  
  const onSubmit = async (values: FormData) => {
    try {
      // Validate files for new agreements
      if (!isEdit && files.length === 0) {
        setFileError("At least one file attachment is required");
        return;
      }

      if (isEdit) {
        // Update existing agreement
        await updateMutation.mutateAsync({
          id: parseInt(id!),
          remark: values.remark,
          files: files.length > 0 ? files : undefined,
          keepExistingFiles: uploadedFiles // Pass the current uploaded files list
        });

        toast({
          title: "Success",
          description: "Agreement updated successfully",
          variant: "default"
        });
      } else {
        // Create new agreement
        await createMutation.mutateAsync({
          siteProfileId: values.site_profile_id,
          remark: values.remark,
          files: files
        });

        toast({
          title: "Success",
          description: "Agreement created successfully",
          variant: "default"
        });
      }

      navigate("/site-management/agreement");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Agreement" : "Create Agreement"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEdit ? "Update site agreement information" : "Create a new site agreement"}
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        {/* Loading state for edit mode */}
        {isEdit && isLoadingAgreement && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading agreement data...</p>
            </div>
          </div>
        )}

        {/* Form content */}
        {(!isEdit || !isLoadingAgreement) && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <FormField
                    name="site_profile_id"
                    control={form.control}
                    rules={{
                      required: "Site profile is required",
                      validate: (value) => {
                        if (!value || value === 0) {
                          return "Site profile is required";
                        }
                        return true;
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Site {isEdit ? "(Read-only)" : "*"}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Select
                              value={field.value ? field.value.toString() : ""}
                              onValueChange={(value) => {
                                const numValue = parseInt(value);
                                field.onChange(numValue);
                              }}
                              disabled={isEdit || isLoadingProfiles || (isEdit && isLoadingAgreement)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={
                                  isEdit ? "Site (read-only)" :
                                    isLoadingProfiles ? "Loading site profiles..." :
                                      (isEdit && isLoadingAgreement) ? "Loading agreement..." :
                                        "Select a site profile"
                                } />
                              </SelectTrigger>
                              <SelectContent>
                                {profiles.map((profile) => (
                                  <SelectItem key={profile.id} value={profile.id.toString()}>
                                    {profile.sitename} {profile.fullname && `(${profile.fullname})`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {field.value && !isEdit && (
                              <button
                                type="button"
                                className="absolute right-8 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                                onClick={() => field.onChange(undefined)}
                              >
                                <X className="h-4 w-4 text-gray-500" />
                              </button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />                  {/* File Upload Section */}
                  <div className="space-y-4">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Attachments {!isEdit && "*"}
                    </FormLabel>                    {/* File Upload Input */}
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${
                      fileError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="h-8 w-8 text-gray-400" />                        <span className="text-sm text-gray-600">
                          Click to upload files or drag and drop
                        </span>
                        <span className="text-xs text-gray-500">
                          PDF, DOC, DOCX, TXT, JPG, JPEG, PNG {!isEdit && "(Required)"}
                        </span>
                      </label>
                    </div>

                    {/* Selected Files */}
                    {files.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded border">
                            <div className="flex items-center gap-2">
                              <FileIcon className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-blue-800">{file.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                        {uploadedFiles.map((filePath, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded border">
                            <div className="flex items-center gap-2">
                              <FileIcon className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-800">
                                {filePath.split('/').pop() || filePath}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeUploadedFile(index)}
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}                      </div>
                    )}

                    {/* File Error Message */}
                    {fileError && (
                      <p className="text-sm text-red-600 mt-2">{fileError}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <FormField
                    name="remark"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Remarks
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter remarks (optional)"
                            className="min-h-[300px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-8 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/site-management/agreement")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending || isLoadingAgreement}
                >
                  {createMutation.isPending || updateMutation.isPending ?
                    "Processing..." :
                    (isEdit ? "Save Changes" : "Create Agreement")
                  }
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default AgreementForm;