import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, FileImage } from 'lucide-react';
import { SUPABASE_URL } from "@/integrations/supabase/client";

interface FileViewerProps {
  path: string;
  filename: string;
}

const FileViewer: React.FC<FileViewerProps> = ({ path, filename }) => {
  // Check if the path already includes the SUPABASE_URL
  const fullUrl = path.startsWith('http') ? path : `${SUPABASE_URL}${path}`;
  
  const isPDF = filename.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
  
  // Function to open file in a new window
  const handleOpenFile = () => {
    window.open(fullUrl, '_blank');
  };

  return (
    <div className="flex items-center gap-2">
      {isPDF ? (
        <FileText className="h-4 w-4 text-red-600" />
      ) : isImage ? (
        <FileImage className="h-4 w-4 text-green-600" />
      ) : (
        <FileText className="h-4 w-4 text-blue-600" />
      )}
      
      <span className="flex-1 truncate">
        {filename.length > 40 ? filename.substring(0, 37) + '...' : filename}
      </span>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        onClick={handleOpenFile}
      >
        <ExternalLink className="h-3.5 w-3.5 mr-1" />
        View
      </Button>
    </div>
  );
};

export default FileViewer;
