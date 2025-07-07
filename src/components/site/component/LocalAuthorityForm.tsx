import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useSiteProfiles } from "@/components/member/hook/useSiteProfile";
import {
  useGetSiteLocalAuthorityById,
  useCreateSiteLocalAuthority,
  useUpdateSiteLocalAuthority,
} from "@/hooks/site-local-authority/use-site-local-authority";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SiteSelect } from "@/components/shared/SiteSelect";
import { Upload, X, FileIcon } from "lucide-react";

interface FormData {
  site_profile_id: number | undefined;
  start_date: string;
  end_date: string;
}

const LocalAuthorityForm = () => {
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
  
  // Local Authority hooks
  const { data: localAuthorityData, isLoading: isLoadingLocalAuthority } = useGetSiteLocalAuthorityById(
    isEdit ? parseInt(id!) : 0
  );
  const createMutation = useCreateSiteLocalAuthority();
  const updateMutation = useUpdateSiteLocalAuthority();
  
  const form = useForm<FormData>({
    defaultValues: {
      site_profile_id: undefined as any,
      start_date: "",
      end_date: "",
    },
  });  
  
  // Reset form with local authority data when available and profiles are loaded
  useEffect(() => {
    if (isEdit && localAuthorityData && !isLoadingProfiles && profiles.length > 0) {
      const siteProfileId = localAuthorityData.site_profile_id?.id;

      // Verify the profile exists in the loaded profiles
      const profileExists = siteProfileId ? profiles.find(p => p.id === siteProfileId) : null;

      form.reset({
        site_profile_id: profileExists ? siteProfileId : undefined as any,
        start_date: localAuthorityData.start_date || "",
        end_date: localAuthorityData.end_date || "",
      });

      // Set uploaded files from existing data
      if (localAuthorityData.file_path && Array.isArray(localAuthorityData.file_path)) {
        setUploadedFiles(localAuthorityData.file_path);
      }
    }
  }, [isEdit, localAuthorityData, form, isLoadingProfiles, profiles]);
  
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
      // Validate file attachments - required for both create and edit
      if (files.length === 0 && uploadedFiles.length === 0) {
        setFileError("At least one attachment is required");
        return;
      }
      
      // Clear any previous file errors
      setFileError("");

      if (isEdit) {        
        // Update existing local authority
        await updateMutation.mutateAsync({
          id: parseInt(id!),
          startDate: values.start_date,
          endDate: values.end_date,
          files: files.length > 0 ? files : undefined,
          keepExistingFiles: uploadedFiles // Pass the current uploaded files list
        });

        toast({
          title: "Success",
          description: "Local Authority updated successfully",
          variant: "default"
        });

      } else {        
        // Create new local authority
        await createMutation.mutateAsync({
          siteProfileId: values.site_profile_id!,
          startDate: values.start_date,
          endDate: values.end_date,
          files: files
        });

        toast({
          title: "Success",
          description: "Local Authority created successfully",
          variant: "default"
        });
      }

      navigate("/site-management/local-authority");

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
          {isEdit ? "Edit Local Authority" : "Create Local Authority"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEdit ? "Update local authority information" : "Create a new local authority record"}
        </p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        {/* Loading state for edit mode */}
        {isEdit && isLoadingLocalAuthority && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading local authority data...</p>
            </div>
          </div>
        )}

        {/* Form content */}
        {(!isEdit || !isLoadingLocalAuthority) && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Form Fields */}
                <div className="space-y-6">
                  <FormField
                    name="site_profile_id"
                    control={form.control}
                    rules={{
                      required: "Site is required",
                      validate: (value) => {
                        if (!value || value === 0) {
                          return "Site is required";
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
                          <SiteSelect
                            data={profiles}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isEdit}
                            isLoading={isLoadingProfiles}
                            placeholder={isEdit ? "Site (read-only)" : "Select a site"}
                            allowDisabledSelection={isEdit}
                            showClearButton={!isEdit}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Start Date Field */}
                  <FormField
                    name="start_date"
                    control={form.control}
                    rules={{ required: "Start date is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Start Date *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            placeholder="Select start date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* End Date Field */}
                  <FormField
                    name="end_date"
                    control={form.control}
                    rules={{ 
                      required: "End date is required",
                      validate: (value) => {
                        const startDate = form.getValues("start_date");
                        if (startDate && value && new Date(value) < new Date(startDate)) {
                          return "End date must be after start date";
                        }
                        return true;
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          End Date *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            placeholder="Select end date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Column - File Attachments */}
                <div className="space-y-6">
                  {/* File Upload Section */}
                  <div className="space-y-4">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Attachments *
                    </FormLabel>

                    {/* File Upload Input */}
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${fileError ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
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
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Click to upload files or drag and drop
                        </span>
                        <span className="text-xs text-gray-500">
                          PDF, DOC, DOCX, TXT, JPG, JPEG, PNG (Required)
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
                        ))}
                      </div>
                    )}

                    {/* File Error Message */}
                    {fileError && (
                      <p className="text-sm text-red-600 mt-2">{fileError}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-8 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/site-management/local-authority")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending || isLoadingLocalAuthority}
                >
                  {createMutation.isPending || updateMutation.isPending ?
                    "Processing..." :
                    (isEdit ? "Save Changes" : "Create Local Authority")
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

export default LocalAuthorityForm;