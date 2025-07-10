import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cleanIdentityNumber, insertAndCleanupMember } from './validate';
import DataTable, { Column } from '@/components/ui/datatable';
import { FileUpload } from '@/components/ui/file-upload';

interface CSVRow {
    FULLNAME: string;
    IDENTITY_NO: string;
    IDENTITY_TYPE: string;
    GENDER: string;
    RACE: string;
    PDPA_DECLARE: string;
    AGREE_DECLARE: string;
    NATIONALITY: string;
    MADANI_COMMUNITY: string;
    ENTREPRENEUR_STATUS: string;
    GUARDIAN_NAME: string;
    ADDRESS1: string;
    ADDRESS2: string;
    NADI_SITE: string;
    DISTRICT: string;
    STATE: string;
    POSTCODE: string;
    CITY: string;
    COMPLETE_FORM: string;
    IDENTITY_NO_VALID: string;
    RESULT: string;
    REASONS: string;
}

const CSVUpload: React.FC = () => {
    const [csvData, setCsvData] = useState<CSVRow[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const requiredFields = ['FULLNAME', 'IDENTITY_NO', 'IDENTITY_TYPE', 'GENDER'];

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);

        try {
            const text = await file.text();
            const lines = text.split('\n').filter(line => line.trim());
            // Change from tab to comma separation
            const headers = lines[0].split(',');

            // Validate headers
            const expectedHeaders = [
                'FULLNAME', 'IDENTITY_NO', 'IDENTITY_TYPE', 'GENDER', 'RACE',
                'PDPA_DECLARE', 'AGREE_DECLARE', 'NATIONALITY', 'MADANI_COMMUNITY',
                'ENTREPRENEUR_STATUS', 'GUARDIAN_NAME', 'ADDRESS1', 'ADDRESS2',
                'NADI_SITE', 'DISTRICT', 'STATE', 'POSTCODE', 'CITY'
            ];

            const processedData: CSVRow[] = [];

            for (let i = 1; i < lines.length; i++) {
                // Change from tab to comma separation
                const values = lines[i].split(',');
                const row: any = {};

                headers.forEach((header, index) => {
                    row[header.trim()] = values[index]?.trim() || '';
                });

                // Check required fields
                const missingFields = requiredFields.filter(field => !row[field]);
                const isComplete = missingFields.length === 0;

                row.COMPLETE_FORM = isComplete ? 'PASS' : 'FORM INCOMPLETE';

                // Validate Identity Number
                let identityValid = false;
                if (row.IDENTITY_NO && row.IDENTITY_TYPE) {
                    try {
                        const cleaned = cleanIdentityNumber(row.IDENTITY_NO, parseInt(row.IDENTITY_TYPE));
                        identityValid = cleaned === row.IDENTITY_NO.replace(/-/g, '');
                    } catch (error) {
                        identityValid = false;
                    }
                }
                row.IDENTITY_NO_VALID = identityValid ? 'PASS' : 'FAILED';

                // Test database insertion
                let insertResult = false;
                if (isComplete && identityValid) {
                    try {
                        const memberData = {
                            fullname: row.FULLNAME,
                            identity_no: cleanIdentityNumber(row.IDENTITY_NO, parseInt(row.IDENTITY_TYPE)),
                            identity_no_type: parseInt(row.IDENTITY_TYPE),
                            gender: parseInt(row.GENDER),
                            race_id: parseInt(row.RACE),
                            pdpa_declare: row.PDPA_DECLARE?.toLowerCase() === 'true',
                            agree_declare: row.AGREE_DECLARE?.toLowerCase() === 'true',
                            nationality_id: parseInt(row.NATIONALITY),
                            community_status: row.MADANI_COMMUNITY?.toLowerCase() === 'true',
                            status_entrepreneur: row.ENTREPRENEUR_STATUS?.toLowerCase() === 'true',
                            supervision: row.GUARDIAN_NAME,
                            address1: row.ADDRESS1,
                            address2: row.ADDRESS2,
                            ref_id: parseInt(row.NADI_SITE),
                            district_id: parseInt(row.DISTRICT),
                            state_id: parseInt(row.STATE),
                            postcode: row.POSTCODE,
                            city: row.CITY,
                        };

                        insertResult = await insertAndCleanupMember(memberData);
                    } catch (error) {
                        insertResult = false;
                    }
                }

                row.RESULT = insertResult ? 'PASS' : 'FAILED';
                processedData.push(row);
            }

            setCsvData(processedData);
        } catch (error) {
            console.error('Error processing CSV:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const columns: Column[] = [
        {
            key: (_, i) => `${i + 1}.`,
            header: "No",
            width: "3%",
            visible: true,
            align: "center" as const,
        },
        {
            key: "FULLNAME",
            header: "Full Name",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "8%",
            render: (value) => value || "-",
        },
        {
            key: "IDENTITY_NO",
            header: "Identity No",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "7%",
            render: (value) => value || "-",
        },
        {
            key: "IDENTITY_TYPE",
            header: "ID Type",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "GENDER",
            header: "Gender",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "RACE",
            header: "Race",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "NATIONALITY",
            header: "Nationality",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "ADDRESS1",
            header: "Address 1",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "8%",
            render: (value) => value || "-",
        },
        {
            key: "ADDRESS2",
            header: "Address 2",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "8%",
            render: (value) => value || "-",
        },
        {
            key: "DISTRICT",
            header: "District",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "STATE",
            header: "State",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "NADI_SITE",
            header: "NADI Site",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "COMPLETE_FORM",
            header: "Form Complete",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "8%",
            render: (value) => (
                <Badge
                    variant="outline"
                    className={value === 'PASS' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}
                >
                    {value}
                </Badge>
            ),
        },
        {
            key: "IDENTITY_NO_VALID",
            header: "Identity Number Valid",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "7%",
            render: (value) => (
                <Badge
                    variant="outline"
                    className={value === 'PASS' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}
                >
                    {value}
                </Badge>
            ),
        },
        {
            key: "RESULT",
            header: "Result",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "7%",
            render: (value) => (
                <Badge
                    variant="outline"
                    className={value === 'PASS' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}
                >
                    {value}
                </Badge>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">CSV Bulk Upload</h1>
                    <p className="text-gray-600 mt-1">
                        Upload and validate member data via CSV file
                    </p>
                </div>
            </div>

            {/* Upload Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Upload CSV File
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <FileUpload
                            maxFiles={1}
                            acceptedFileTypes=".csv"
                            maxSizeInMB={10}
                            buttonText="Choose CSV File"
                            onChange={handleFileUpload}
                        />

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex">
                                <AlertCircle className="h-5 w-5 text-yellow-400" />
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        CSV Format Requirements
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p><strong>Required Headers (comma-separated):</strong></p>
                                        <p className="font-mono text-xs mt-1">
                                            FULLNAME,IDENTITY_NO,IDENTITY_TYPE,GENDER,RACE,PDPA_DECLARE,AGREE_DECLARE,NATIONALITY,MADANI_COMMUNITY,ENTREPRENEUR_STATUS,GUARDIAN_NAME,ADDRESS1,ADDRESS2,NADI_SITE,DISTRICT,STATE,POSTCODE,CITY
                                        </p>
                                        <p className="mt-2"><strong>Required Fields:</strong> FULLNAME, IDENTITY_NO, IDENTITY_TYPE, GENDER</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Table */}
            {csvData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Validation Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={csvData}
                            columns={columns}
                            pageSize={15}
                            isLoading={isProcessing}
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default CSVUpload;