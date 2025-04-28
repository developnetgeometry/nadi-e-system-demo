import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, File, X } from "lucide-react";

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFilesSelected?: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
  maxSizeInMB?: number;
  buttonText?: string;
  showPreview?: boolean;
  existingFile?: { url: string; name: string } | null;
  existingFiles?: Array<{ url: string; name: string }> | null;
  children?: React.ReactNode;
  multiple?: boolean;
}

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      className,
      onFilesSelected,
      maxFiles = 1,
      acceptedFileTypes,
      maxSizeInMB = 5,
      buttonText = "Upload File",
      showPreview = true,
      existingFile = null,
      existingFiles = null,
      multiple = false,
      children,
      ...props
    },
    ref
  ) => {
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    // Update maxFiles based on multiple prop
    const effectiveMaxFiles = multiple ? maxFiles : 1;

    // Handle existing files display
    const initialExistingFiles = React.useMemo(() => {
      if (existingFiles) {
        return existingFiles;
      } else if (existingFile) {
        return [existingFile];
      }
      return [];
    }, [existingFile, existingFiles]);

    const [displayedExistingFiles, setDisplayedExistingFiles] = React.useState(initialExistingFiles);

    React.useEffect(() => {
      const newExistingFiles = existingFiles || (existingFile ? [existingFile] : []);
      setDisplayedExistingFiles(newExistingFiles.filter(Boolean));
    }, [existingFile, existingFiles]);

    // Add reset method to the component
    React.useImperativeHandle(ref, () => ({
      ...inputRef.current,
      reset: () => {
        setSelectedFiles([]);
        setError(null);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        if (onFilesSelected) {
          onFilesSelected([]);
        }
      }
    }));

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const filesArray = Array.from(event.target.files);

      // For non-multiple mode, replace existing files
      const newSelectedFiles = multiple 
        ? [...selectedFiles, ...filesArray]
        : filesArray;

      // Validate number of files
      if (newSelectedFiles.length > effectiveMaxFiles) {
        setError(
          `You can only upload up to ${effectiveMaxFiles} file${
            effectiveMaxFiles === 1 ? "" : "s"
          }`
        );
        return;
      }

      // Validate file size - check each file individually
      const oversizedFiles = filesArray.filter(
        (file) => file.size > maxSizeInMB * 1024 * 1024
      );
      if (oversizedFiles.length > 0) {
        setError(`Each file must be less than ${maxSizeInMB}MB`);
        return;
      }

      // Validate file type if acceptedFileTypes is provided
      if (acceptedFileTypes) {
        const acceptedTypes = acceptedFileTypes.split(',').map(type => type.trim().toLowerCase());
        
        // Check if any file doesn't match the accepted types
        const invalidFiles = filesArray.filter(file => {
          const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
          return !acceptedTypes.some(type => {
            // Handle both mimetype patterns (image/*) and extensions (.pdf)
            if (type.includes('/')) {
              return file.type.match(new RegExp(type.replace('*', '.*')));
            } else {
              return fileExtension === type;
            }
          });
        });

        if (invalidFiles.length > 0) {
          setError(`Only ${acceptedFileTypes} files are allowed`);
          return;
        }
      }

      setSelectedFiles(newSelectedFiles);

      if (onFilesSelected) {
        onFilesSelected(newSelectedFiles);
      }
    };

    const handleRemoveFile = (index: number) => {
      const newFiles = [...selectedFiles];
      newFiles.splice(index, 1);
      setSelectedFiles(newFiles);

      if (onFilesSelected) {
        onFilesSelected(newFiles);
      }

      // Reset the input value to allow selecting the same file again
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    const handleRemoveExistingFile = (index: number) => {
      const newFiles = [...displayedExistingFiles];
      newFiles.splice(index, 1);
      setDisplayedExistingFiles(newFiles);
    };

    const triggerFileInput = () => {
      if (inputRef.current) {
        inputRef.current.click();
      }
    };

    const getPlaceholderText = () => {
      if (selectedFiles.length >= effectiveMaxFiles) {
        return "Maximum number of files reached";
      }
      
      return `Drag and drop your file${multiple ? "s" : ""} here, or click to browse`;
    };

    return (
      <div className={cn("space-y-4", className)}>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 cursor-pointer transition-colors",
            error ? "border-destructive" : "border-muted-foreground/20",
            selectedFiles.length >= effectiveMaxFiles ? "opacity-50 cursor-not-allowed" : ""
          )}
          onClick={selectedFiles.length < effectiveMaxFiles ? triggerFileInput : undefined}
        >
          <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">
            {getPlaceholderText()}
          </p>
          <p className="text-xs text-muted-foreground">
            {acceptedFileTypes ? `Accepted formats: ${acceptedFileTypes}` : ""}
            {acceptedFileTypes && maxSizeInMB ? " • " : ""}
            {maxSizeInMB ? `Each file max ${maxSizeInMB}MB` : ""}
            {effectiveMaxFiles > 1 ? ` • Max ${effectiveMaxFiles} files` : ""}
          </p>
          <Input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={acceptedFileTypes}
            multiple={multiple}
            disabled={selectedFiles.length >= effectiveMaxFiles}
            {...props}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive font-medium">{error}</p>
        )}

        {/* Show existing files */}
        {displayedExistingFiles.length > 0 && selectedFiles.length === 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Existing File{displayedExistingFiles.length > 1 ? "s" : ""}:</p>
            <div className="grid gap-2">
              {displayedExistingFiles.map((file, index) => (
                <div
                  key={`existing-${index}`}
                  className="flex items-center p-2 border rounded-md bg-muted/30"
                >
                  <File className="h-4 w-4 mr-2" />
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline flex-1 truncate"
                  >
                    {file.name}
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveExistingFile(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show selected files */}
        {showPreview && selectedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected file{selectedFiles.length > 1 ? "s" : ""}:</p>
            <div className="grid gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center p-2 border rounded-md bg-muted/30"
                >
                  <File className="h-4 w-4 mr-2" />
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedFiles.length < effectiveMaxFiles && (
          <Button 
            type="button" 
            onClick={triggerFileInput} 
            className="mt-2"
            disabled={selectedFiles.length >= effectiveMaxFiles}
          >
            {children}
            {!children && buttonText}
          </Button>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";
