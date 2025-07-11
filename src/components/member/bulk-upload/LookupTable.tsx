import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable, { Column } from "@/components/ui/datatable";
import useGeneralData from "@/hooks/use-general-data";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import useGeoData from '@/hooks/use-geo-data';
import { useSiteProfileAll } from '../hook/useSiteProfile';


const LookupTable: React.FC = () => {
    const { identityNoTypes, genders, races, nationalities, error: error1 } = useGeneralData();
    const { districts, error: error2 } = useGeoData();
    const { profiles, error: error3 } = useSiteProfileAll();

    const [activeTab, setActiveTab] = useState("genders");

    if (error1 || error2) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-600">Error loading lookup data: {error1}</div>
            </div>
        );
    }

    // Gender columns configuration
    const genderColumns: Column[] = [
        {
            key: (_, i) => `${i + 1}.`,
            header: "No",
            width: "10%",
            visible: true,
            align: "center" as const,
        },
        {
            key: "id",
            header: "ID",
            filterable: true,
            visible: true,
            filterType: "number" as const,
            align: "center" as const,
            width: "15%",
            render: (value) => (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {value}
                </Badge>
            ),
        },
        {
            key: "eng",
            header: "English",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "35%",
            render: (value) => value || "-",
        },
        {
            key: "bm",
            header: "Bahasa Malaysia",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "35%",
            render: (value) => value || "-",
        },
    ];

    // Race columns configuration
    const raceColumns: Column[] = [
        {
            key: (_, i) => `${i + 1}.`,
            header: "No",
            width: "10%",
            visible: true,
            align: "center" as const,
        },
        {
            key: "id",
            header: "ID",
            filterable: true,
            visible: true,
            filterType: "number" as const,
            align: "center" as const,
            width: "15%",
            render: (value) => (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {value}
                </Badge>
            ),
        },
        {
            key: "eng",
            header: "English",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "35%",
            render: (value) => value || "-",
        },
        {
            key: "bm",
            header: "Bahasa Malaysia",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "35%",
            render: (value) => value || "-",
        },
    ];

    // Identity No Types columns configuration
    const identityNoTypeColumns: Column[] = [
        {
            key: (_, i) => `${i + 1}.`,
            header: "No",
            width: "10%",
            visible: true,
            align: "center" as const,
        },
        {
            key: "id",
            header: "ID",
            filterable: true,
            visible: true,
            filterType: "number" as const,
            align: "center" as const,
            width: "15%",
            render: (value) => (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {value}
                </Badge>
            ),
        },
        {
            key: "eng",
            header: "English",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "35%",
            render: (value) => value || "-",
        },
        {
            key: "bm",
            header: "Bahasa Malaysia",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "35%",
            render: (value) => value || "-",
        },
    ];

    // Nationalities columns configuration
    const nationalityColumns: Column[] = [
        {
            key: (_, i) => `${i + 1}.`,
            header: "No",
            width: "10%",
            visible: true,
            align: "center" as const,
        },
        {
            key: "id",
            header: "ID",
            filterable: true,
            visible: true,
            filterType: "number" as const,
            align: "center" as const,
            width: "15%",
            render: (value) => (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {value}
                </Badge>
            ),
        },
        {
            key: "eng",
            header: "English",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "35%",
            render: (value) => value || "-",
        },
        {
            key: "bm",
            header: "Bahasa Malaysia",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "35%",
            render: (value) => value || "-",
        },
    ];

    const districtColumns: Column[] = [
        {
            key: (_, i) => `${i + 1}.`,
            header: "No",
            width: "8%",
            visible: true,
            align: "center" as const,
        },
        {
            key: "id",
            header: "District ID",
            filterable: true,
            visible: true,
            filterType: "number" as const,
            align: "center" as const,
            width: "12%",
            render: (value) => (
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    {value}
                </Badge>
            ),
        },
        {
            key: "name",
            header: "District Name",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "30%",
            render: (value) => value || "-",
        },
        {
            key: "state_id.id",
            header: "State ID",
            filterable: true,
            visible: true,
            filterType: "number" as const,
            align: "center" as const,
            width: "12%",
            render: (value, row) => (
                <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                    {row.state_id?.id || "-"}
                </Badge>
            ),
        },
        {
            key: "state_id.name",
            header: "State Name",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "30%",
            render: (value, row) => row.state_id?.name || "-",
        },
    ];

    // Add after districtColumns configuration
    const siteProfileColumns: Column[] = [
        {
            key: (_, i) => `${i + 1}.`,
            header: "No",
            width: "5%",
            visible: true,
            align: "center" as const,
        },
        {
            key: "id",
            header: "Site ID",
            visible: true,
            align: "center" as const,
            width: "8%",
            render: (value) => (
                <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
                    {value}
                </Badge>
            ),
        },
        {
            key: "sitename",
            header: "Site Name",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "15%",
            render: (value) => value || "-",
        },
        {
            key: "fullname",
            header: "Full Name",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "20%",
            render: (value) => value || "-",
        },
        {
            key: "standard_code",
            header: "Standard Code",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "12%",
            render: (value) => value || "-",
        },
        {
            key: "refid_mcmc",
            header: "MCMC Ref ID",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "15%",
            render: (value) => value || "-",
        },
        {
            key: "refid_tp",
            header: "TP Ref ID",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "15%",
            render: (value) => value || "-",
        },
        {
            key: "name_tp",
            header: "TP",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "15%",
            render: (value) => value || "-",
        },
        {
            key: "name_dusp",
            header: "DUSP",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "15%",
            render: (value) => value || "-",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Lookup Tables</h1>
                    <p className="text-gray-600 mt-1">
                        Reference data for member registration and bulk upload
                    </p>
                </div>
            </div>

            {/* Lookup Tables */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Reference Data Tables
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                        <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="genders" className="flex items-center gap-2">
                                Genders
                            </TabsTrigger>
                            <TabsTrigger value="races" className="flex items-center gap-2">
                                Races
                            </TabsTrigger>
                            <TabsTrigger value="identityNoTypes" className="flex items-center gap-2">
                                Identity Types
                            </TabsTrigger>
                            <TabsTrigger value="nationalities" className="flex items-center gap-2">
                                Nationalities
                            </TabsTrigger>
                            <TabsTrigger value="districts" className="flex items-center gap-2">
                                Districts & States
                            </TabsTrigger>
                            <TabsTrigger value="siteProfiles" className="flex items-center gap-2">
                                NADI Sites
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="genders" className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <DataTable
                                    data={genders || []}
                                    columns={genderColumns}
                                    pageSize={10}
                                    isLoading={!genders.length && !error1}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="races" className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <DataTable
                                    data={races || []}
                                    columns={raceColumns}
                                    pageSize={10}
                                    isLoading={!races.length && !error1}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="identityNoTypes" className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <DataTable
                                    data={identityNoTypes || []}
                                    columns={identityNoTypeColumns}
                                    pageSize={10}
                                    isLoading={!identityNoTypes.length && !error1}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="nationalities" className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <DataTable
                                    data={nationalities || []}
                                    columns={nationalityColumns}
                                    pageSize={10}
                                    isLoading={!nationalities.length && !error1}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="districts" className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <DataTable
                                    data={districts || []}
                                    columns={districtColumns}
                                    pageSize={10}
                                    isLoading={!districts.length && !error2}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="siteProfiles" className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <DataTable
                                    data={profiles || []}
                                    columns={siteProfileColumns}
                                    pageSize={10}
                                    isLoading={!profiles.length && !error3}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Usage Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle>Usage Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-800 mb-2">For Bulk Upload CSV:</h4>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• Use the <strong>ID</strong> values from these tables in your CSV files</li>
                                <li>• For Gender: Use ID values (1, 2, etc.) not the text values</li>
                                <li>• For Race: Use ID values (1, 2, 3, etc.) not the text values</li>
                                <li>• For Identity Type: Use ID values (1, 2, 3, etc.) not the text values</li>
                                <li>• For Nationality: Use ID values (1, 2, 3, etc.) not the text values</li>
                                <li>• For District: Use District ID values from the Districts & States table</li>
                                <li>• For State: Use State ID values from the Districts & States table</li>
                                <li>• For NADI Site: ID values from the Site Profiles table</li>
                                <li>• Always refer to these tables for the most up-to-date reference data</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-800 mb-2">Data Structure:</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• <strong>ID:</strong> Unique identifier for database reference</li>
                                <li>• <strong>English:</strong> English language display name</li>
                                <li>• <strong>Bahasa Malaysia:</strong> Malay language display name</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LookupTable;