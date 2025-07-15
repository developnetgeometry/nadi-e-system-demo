import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, Download, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cleanIdentityNumber, insertAndCleanupMember, checkICExists, checkEmailExists } from './validate';
import DataTable, { Column } from '@/components/ui/datatable';
import { FileUpload } from '@/components/ui/file-upload';
import { insertMemberData } from '../hook/use-registration-form';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserMetadata } from '@/hooks/use-user-metadata';


interface CSVRow {
    NADI_SITE: string;
    FULLNAME: string;
    IDENTITY_NO: string;
    IDENTITY_TYPE: string;
    EMAIL: string;
    PHONE: string;
    GENDER: string;
    RACE: string;
    PDPA_DECLARE: string;
    AGREE_DECLARE: string;
    NATIONALITY: string;
    GUARDIAN_NAME: string;
    ADDRESS1: string;
    ADDRESS2: string;
    DISTRICT: string;
    STATE: string;
    POSTCODE: string;
    CITY: string;
    MADANI_COMMUNITY: string;
    ENTREPRENEUR_STATUS: string;
    RESULT: string;
    REASONS: string;
    MEMBERSHIP_ID: string;
    PASSWORD: string;
}

const UploadTab: React.FC = () => {
    const userMetadata = useUserMetadata();
    const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
    const siteId = parsedMetadata?.group_profile?.site_profile_id;

    const [csvData, setCsvData] = useState<CSVRow[]>([]);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const requiredFields = ['NADI_SITE', 'FULLNAME', 'IDENTITY_NO', 'IDENTITY_TYPE', 'GENDER'];

    const expectedHeaders = [
        'NADI_SITE', 'FULLNAME', 'IDENTITY_NO', 'IDENTITY_TYPE', 'EMAIL', 'GENDER',
        'RACE', 'NATIONALITY',
        'ENTREPRENEUR_STATUS', 'MADANI_COMMUNITY', 'PDPA_DECLARE', 'AGREE_DECLARE', 'GUARDIAN_NAME',
        'ADDRESS1', 'ADDRESS2', 'DISTRICT', 'STATE', 'POSTCODE', 'CITY'
    ];

    const downloadTemplate = () => {
        // Create sample data
        const templateData = [
            expectedHeaders,
            [
                siteId || '0',                 // NADI_SITE
                'John Doe',           // FULLNAME
                '000111-22-3333',       // IDENTITY_NO
                '1',                  // IDENTITY_TYPE (1 = IC)
                'johndoe@gmail.com',  // EMAIL
                '1',                  // GENDER (1 = Male)
                '322',                  // RACE
                '1',                  // NATIONALITY
                'false',              // ENTREPRENEUR_STATUS
                'true',               // MADANI_COMMUNITY
                'true',               // PDPA_DECLARE
                'true',               // AGREE_DECLARE
                'Jane Doe',           // GUARDIAN_NAME
                '123 Main Street',    // ADDRESS1
                'Apt 4B',            // ADDRESS2
                '1',                  // DISTRICT
                '501',                  // STATE
                '12345',              // POSTCODE
                'Kuala Lumpur',        // CITY

            ],
            [
                siteId || '0',                 // NADI_SITE
                'Jane Smith',         // FULLNAME
                '000222-33-4444',       // IDENTITY_NO
                '1',                  // IDENTITY_TYPE
                'janesmith@gmail.com',  // EMAIL
                '2',                  // GENDER (1 = Male)
                '302',                  // RACE
                '1',                  // NATIONALITY
                'false',              // ENTREPRENEUR_STATUS
                'true',               // MADANI_COMMUNITY
                'true',               // PDPA_DECLARE
                'true',               // AGREE_DECLARE
                'Jane Doe',           // GUARDIAN_NAME
                '123 Main Street',    // ADDRESS1
                'Apt 4B',            // ADDRESS2
                '21',                  // DISTRICT
                '502',                  // STATE
                '12345',              // POSTCODE
                'Kuala Lumpur',        // CITY

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


    const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setFileName(file.name);
    };


    const handleFileUpload = async () => {

        if (!selectedFile) return;

        setIsProcessing(true);

        try {
            const text = await selectedFile.text();
            const lines = text.split('\n').filter(line => line.trim());
            // Change from tab to comma separation
            const headers = lines[0].split(',');


            const processedData: CSVRow[] = [];

            for (let i = 1; i < lines.length; i++) {
                // Change from tab to comma separation
                const values = lines[i].split(',');
                const row: any = {};
                let reasons: string[] = [];
                let validationFailed = false;

                headers.forEach((header, index) => {
                    row[header.trim()] = values[index]?.trim() || '';
                });

                // Step 1: Check required fields
                const missingFields = requiredFields.filter(field => !row[field]);
                if (missingFields.length > 0) {
                    validationFailed = true;
                    reasons.push(`Missing required fields: ${missingFields.join(', ')}`);
                    row.RESULT = 'FAILED';
                    row.REASONS = reasons.join('; ');
                    processedData.push(row);
                    continue; // Skip to next row
                }

                // Step 2: Validate Identity Number (only if required fields check passed)
                if (!validationFailed) {
                    let identityValid = false;
                    let cleanedIdentityNumber = '';

                    if (row.IDENTITY_NO && row.IDENTITY_TYPE) {
                        try {
                            // Clean the identity number
                            cleanedIdentityNumber = cleanIdentityNumber(row.IDENTITY_NO, parseInt(row.IDENTITY_TYPE));

                            // Check if the cleaned identity number exists in database
                            const icExists = await checkICExists(cleanedIdentityNumber);

                            // Identity is valid if it's unique (doesn't exist in database)
                            identityValid = !icExists;

                            if (!identityValid) {
                                validationFailed = true;
                                reasons.push("Identity number already exists in database");
                            }
                        } catch (error) {
                            validationFailed = true;
                            reasons.push("Invalid identity number format");
                        }
                    } else {
                        validationFailed = true;
                        reasons.push("Identity number or type is missing");
                    }

                    if (validationFailed) {
                        row.RESULT = 'FAILED';
                        row.REASONS = reasons.join('; ');
                        processedData.push(row);
                        continue; // Skip to next row
                    }
                }

                // Step 3: Validate Email (only if required fields and identity checks passed)
                if (!validationFailed) {
                    let emailValid = false;

                    if (row.EMAIL) {
                        try {
                            // Clean and validate email format
                            const email = row.EMAIL.trim().toLowerCase();
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                            if (!emailRegex.test(email)) {
                                validationFailed = true;
                                reasons.push("Invalid email format");
                            } else {
                                // Check if email exists in database
                                const emailExists = await checkEmailExists(email);

                                if (emailExists) {
                                    validationFailed = true;
                                    reasons.push("Email already exists in database");
                                } else {
                                    emailValid = true;
                                }
                            }
                        } catch (error) {
                            validationFailed = true;
                            reasons.push("Error validating email");
                        }
                    } else {
                        validationFailed = true;
                        reasons.push("Email is missing");
                    }

                    if (validationFailed) {
                        row.RESULT = 'FAILED';
                        row.REASONS = reasons.join('; ');
                        processedData.push(row);
                        continue; // Skip to next row
                    }
                }


                // Step 4: Test database insertion (only if all previous validations passed)
                if (!validationFailed) {
                    try {
                        const memberData = {
                            fullname: row.FULLNAME,
                            identity_no: cleanIdentityNumber(row.IDENTITY_NO, row.IDENTITY_TYPE),
                            identity_no_type: row.IDENTITY_TYPE,
                            gender: row.GENDER === "" ? null : row.GENDER,
                            race_id: row.RACE === "" ? null : row.RACE,
                            pdpa_declare: row.PDPA_DECLARE?.toLowerCase() === 'true',
                            agree_declare: row.AGREE_DECLARE?.toLowerCase() === 'true',
                            nationality_id: row.NATIONALITY,
                            community_status: row.MADANI_COMMUNITY?.toLowerCase() === 'true',
                            status_entrepreneur: row.ENTREPRENEUR_STATUS?.toLowerCase() === 'true',
                            supervision: row.GUARDIAN_NAME,
                            address1: row.ADDRESS1,
                            address2: row.ADDRESS2,
                            ref_id: row.NADI_SITE,
                            district_id: row.DISTRICT,
                            state_id: row.STATE,
                            postcode: row.POSTCODE,
                            city: row.CITY,
                        };

                        const insertResult = await insertAndCleanupMember(memberData);

                        if (!insertResult.success) {
                            validationFailed = true;
                            if (insertResult.error) {
                                // Handle foreign key constraint violations
                                if (insertResult.error.includes('violates foreign key constraint')) {
                                    if (insertResult.error.includes('race_id_fkey')) {
                                        reasons.push(`Race ID ${row.RACE} does not exist in table Races`);
                                    } else if (insertResult.error.includes('gender_fkey')) {
                                        reasons.push(`Gender ID ${row.GENDER} does not exist in table Genders`);
                                    } else if (insertResult.error.includes('nationality_id_fkey')) {
                                        reasons.push(`Nationality ID ${row.NATIONALITY} does not exist in table Nationalities`);
                                    } else if (insertResult.error.includes('identity_no_type_fkey')) {
                                        reasons.push(`Identity Type ID ${row.IDENTITY_TYPE} does not exist in table IdentityTypes`);
                                    } else if (insertResult.error.includes('district_id_fkey')) {
                                        reasons.push(`District ID ${row.DISTRICT} does not exist in table Districts`);
                                    } else if (insertResult.error.includes('state_id_fkey')) {
                                        reasons.push(`State ID ${row.STATE} does not exist in table States`);
                                    } else if (insertResult.error.includes('ref_id_fkey')) {
                                        reasons.push(`NADI Site ID ${row.NADI_SITE} does not exist in table NadiSites`);
                                    } else {
                                        reasons.push('Invalid reference ID - check lookup tables');
                                    }
                                } else {
                                    reasons.push(insertResult.error);
                                }
                            } else {
                                reasons.push("Database insertion failed");
                            }
                        }
                    } catch (error) {
                        validationFailed = true;
                        reasons.push(error instanceof Error ? error.message : "Unknown error during database insertion");
                    }

                    if (validationFailed) {
                        row.RESULT = 'FAILED';
                        row.REASONS = reasons.join('; ');
                        processedData.push(row);
                        continue; // Skip to next row
                    }
                }

                // Step 5: Insert member data (only if all previous validations passed)
                if (!validationFailed) {
                    try {
                        const memberInsertData = {
                            identity_no_type: row.IDENTITY_TYPE,
                            identity_no: cleanIdentityNumber(row.IDENTITY_NO, row.IDENTITY_TYPE),
                            fullname: row.FULLNAME,
                            ref_id: row.NADI_SITE,
                            community_status: row.MADANI_COMMUNITY?.toLowerCase() === 'true',
                            mobile_no: row.PHONE || '',
                            email: row.EMAIL,
                            gender: row.GENDER,
                            status_membership: 1, // Default membership status
                            status_entrepreneur: row.ENTREPRENEUR_STATUS?.toLowerCase() === 'true',
                            register_method: "Bulk Upload", // Bulk upload method
                            join_date: new Date().toISOString(),
                            registration_status: true,
                            nationality_id: row.NATIONALITY || '',
                            race_id: row.RACE || '',
                            address1: row.ADDRESS1 || '',
                            address2: row.ADDRESS2 || '',
                            district_id: row.DISTRICT || '',
                            state_id: row.STATE || '',
                            city: row.CITY || '',
                            postcode: row.POSTCODE || '',
                            pdpa_declare: row.PDPA_DECLARE?.toLowerCase() === 'true',
                            agree_declare: row.AGREE_DECLARE?.toLowerCase() === 'true',
                            password: 'password123',

                            isUnder12: false,

                        };

                        const { success, membershipId } = await insertMemberData(memberInsertData);

                        if (!success) {
                            validationFailed = true;
                            reasons.push("Failed to insert member data");
                        } else {
                            // Set membership ID and password for successful insertion
                            row.MEMBERSHIP_ID = membershipId || '';
                            row.PASSWORD = 'password123';
                        }
                    } catch (error) {
                        validationFailed = true;
                        reasons.push(error instanceof Error ? error.message : "Unknown error during member data insertion");
                    }
                }

                // Set final result
                row.RESULT = validationFailed ? 'FAILED' : 'PASS';
                row.REASONS = reasons.length > 0 ? reasons.join('; ') : 'All validations passed';

                processedData.push(row);
            }


            setCsvData(processedData);
        } catch (error) {
            console.error('Error processing CSV:', error);
        } finally {
            setIsProcessing(false);
            setShowConfirmDialog(false);
        }
    };

    const handleReset = () => {
        setCsvData([]);
        setFileName(null);
        setSelectedFile(null);
    };

    const handleUploadClick = () => {
        if (selectedFile) {
            setShowConfirmDialog(true);
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
            header: "Identity Type",
            filterable: false,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "EMAIL",
            header: "Email",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "PHONE",
            header: "Phone No.",
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
            filterable: false,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "RACE",
            header: "Race",
            filterable: false,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "NATIONALITY",
            header: "Nationality",
            filterable: false,
            visible: true,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "ENTREPRENEUR_STATUS",
            header: "Entrepreneur Status",
            filterable: false,
            visible: false,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "MADANI_COMMUNITY",
            header: "MADANI Community",
            filterable: false,
            visible: false,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "PDPA_DECLARE",
            header: "PDPA Declaration",
            filterable: false,
            visible: false,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "AGREE_DECLARE",
            header: "Agreement Declaration",
            filterable: false,
            visible: false,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "GUARDIAN_NAME",
            header: "Guardian Name",
            filterable: false,
            visible: false,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "ADDRESS1",
            header: "Address 1",
            filterable: false,
            visible: false,
            align: "left" as const,
            width: "8%",
            render: (value) => value || "-",
        },
        {
            key: "ADDRESS2",
            header: "Address 2",
            filterable: false,
            visible: false,
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
            key: "POSTCODE",
            header: "Postcode",
            filterable: false,
            visible: false,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
        },
        {
            key: "CITY",
            header: "City",
            filterable: false,
            visible: false,
            filterType: "string" as const,
            align: "center" as const,
            width: "5%",
            render: (value) => value || "-",
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
        {
            key: "REASONS",
            header: "Reasons",
            filterable: false,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "12%",
            render: (value) => (
                <div className="text-sm text-gray-600">
                    {value || "-"}
                </div>
            ),
        },
        {
            key: "MEMBERSHIP_ID",
            header: "Membership ID",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "12%",
            render: (value) => value || "-",
        },
        {
            key: "PASSWORD",
            header: "Generated Password",
            filterable: true,
            visible: true,
            filterType: "string" as const,
            align: "left" as const,
            width: "12%",
            render: (value) => value || "-",
        },
    ];




    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">CSV Bulk Upload</h1>
                    <p className="text-gray-600 mt-1">
                        Upload member data via CSV file
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


                        {(!fileName) ? (
                            <FileUpload
                                maxFiles={1}
                                acceptedFileTypes=".csv"
                                maxSizeInMB={10}
                                buttonText="Choose CSV File"
                                onChange={handleFileSelection}
                            />
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm text-green-700">Selected: {fileName}</p>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleUploadClick}
                                        disabled={!selectedFile || isProcessing}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        {isProcessing ? 'Processing...' : 'Upload & Process'}
                                    </Button>
                                    <Button
                                        onClick={handleReset}
                                        variant="destructive"
                                        disabled={isProcessing}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        )}
                        {/* Confirmation Dialog */}
                        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                            <AlertDialogContent> {/* make sure this is relative so overlay is positioned correctly */}
                                {isProcessing && (
                                    <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center rounded-md">
                                        <Loader2 className="animate-spin w-10 h-10 text-primary" />
                                        <span className="ml-3 text-lg font-semibold">Registering...</span>
                                    </div>
                                )}

                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Upload</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to upload and process this CSV file? This action will validate and potentially insert member data into the database.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    {/* <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel> */}
                                    <button
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                                        disabled={isProcessing}
                                        onClick={handleFileUpload}
                                    >
                                        Confirm Upload
                                    </button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex">
                                <AlertCircle className="h-5 w-5 text-yellow-400" />
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        CSV Format Requirements
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p><strong>Required Headers:</strong></p>
                                        <p className="font-mono text-xs mt-1">
                                            NADI_SITE,FULLNAME,IDENTITY_NO,IDENTITY_TYPE,EMAIL,GENDER
                                        </p>
                                        <p className="mt-2"><strong>Optional Headers:</strong></p>
                                        <p className="font-mono text-xs mt-1">
                                            RACE,PDPA_DECLARE,AGREE_DECLARE,NATIONALITY,MADANI_COMMUNITY,ENTREPRENEUR_STATUS,GUARDIAN_NAME,ADDRESS1,ADDRESS2,DISTRICT,STATE,POSTCODE,CITY
                                        </p>
                                        <p className="mt-2"><strong>Required Fields:</strong> NADI_SITE, FULLNAME, IDENTITY_NO, IDENTITY_TYPE, GENDER</p>
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