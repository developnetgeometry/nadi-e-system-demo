import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import LookupTable from './bulk-upload/LookupTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import CSVUpload from './bulk-upload/ValidateTab';
import UploadTab from './bulk-upload/UploadTab';

const BulkUpload: React.FC = () => {


  return (
    <div className="mx-auto">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Bulk Upload Members</h2>
        <p className="text-gray-600 mt-2">Upload a CSV file to add multiple members at once</p>
      </div>
      <Tabs defaultValue="upload" className="mt-6">
        <TabsList className="border-b dark:border-gray-700 w-full justify-start bg-transparent p-0 h-auto overflow-x-auto mb-6">
          <TabsTrigger value="upload" className="px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Bulk Upload</TabsTrigger>
          <TabsTrigger value="validate" className="px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Validate</TabsTrigger>
          <TabsTrigger value="lookup" className="px-4 py-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Lookup Tables</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="h-full mt-0">
          <Card className="h-full">
            <div className="p-6 h-full">
              <UploadTab/>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="validate" className="h-full mt-0">
          <Card className="h-full">
            <div className="p-6 h-full">
              <CSVUpload/>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="lookup" className="h-full mt-0">
          <Card className="h-full">
            <div className="p-6 h-full">
              <LookupTable/>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BulkUpload;