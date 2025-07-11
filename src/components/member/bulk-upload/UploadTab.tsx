import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle, Download } from 'lucide-react';
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
}

const UploadTab: React.FC = () => {
    const [csvData, setCsvData] = useState<CSVRow[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const requiredFields = ['FULLNAME', 'IDENTITY_NO', 'IDENTITY_TYPE', 'GENDER'];

    const expectedHeaders = [
        'FULLNAME', 'IDENTITY_NO', 'IDENTITY_TYPE', 'GENDER', 'RACE',
        'PDPA_DECLARE', 'AGREE_DECLARE', 'NATIONALITY', 'MADANI_COMMUNITY',
        'ENTREPRENEUR_STATUS', 'GUARDIAN_NAME', 'ADDRESS1', 'ADDRESS2',
        'NADI_SITE', 'DISTRICT', 'STATE', 'POSTCODE', 'CITY'
    ];

    const downloadTemplate = () => {
        // Create sample data
        const templateData = [
            expectedHeaders,
            [
                'John Doe',           // FULLNAME
                '123456789012',       // IDENTITY_NO
                '1',                  // IDENTITY_TYPE (1 = IC)
                '1',                  // GENDER (1 = Male)
                '1',                  // RACE
                'true',               // PDPA_DECLARE
                'true',               // AGREE_DECLARE
                '1',                  // NATIONALITY
                'true',               // MADANI_COMMUNITY
                'false',              // ENTREPRENEUR_STATUS
                'Jane Doe',           // GUARDIAN_NAME
                '123 Main Street',    // ADDRESS1
                'Apt 4B',            // ADDRESS2
                '1',                  // NADI_SITE
                '1',                  // DISTRICT
                '1',                  // STATE
                '12345',              // POSTCODE
                'Kuala Lumpur'        // CITY
            ],
            [
                'Jane Smith',         // FULLNAME
                '987654321098',       // IDENTITY_NO
                '1',                  // IDENTITY_TYPE
                '2',                  // GENDER (2 = Female)
                '2',                  // RACE
                'true',               // PDPA_DECLARE
                'true',               // AGREE_DECLARE
                '1',                  // NATIONALITY
                'false',              // MADANI_COMMUNITY
                'true',               // ENTREPRENEUR_STATUS
                'John Smith',         // GUARDIAN_NAME
                '456 Oak Avenue',     // ADDRESS1
                '',                   // ADDRESS2
                '2',                  // NADI_SITE
                '2',                  // DISTRICT
                '1',                  // STATE
                '54321',              // POSTCODE
                'Petaling Jaya'       // CITY
            ]
        ];

        // Convert to CSV format (comma-separated)
        const csvContent = templateData.map(row => row.join(',')).join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'member_bulk_upload_template.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);

        try {
            const text = await file.text();
            const lines = text.split('\n').filter(line => line.trim());
            const headers = lines[0].split('\t');

            const processedData: CSVRow[] = [];

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split('\t');
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

                        // insertResult = await insertAndCleanupMember(memberData);
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
        // ... your existing columns configuration
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

            {/* Download Template Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-blue-800">CSV Template</h3>
                            <p className="text-blue-600">Download the template to ensure proper formatting</p>
                        </div>
                    </div>
                    <button
                        onClick={downloadTemplate}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        <span>Download Template</span>
                    </button>
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
                                        <p className="mt-2"><strong>Required Fields:</strong> {requiredFields.join(', ')}</p>
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

export default UploadTab;