import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cleanIdentityNumber, insertAndCleanupMember, checkICExists, checkEmailExists } from './validate';
import DataTable, { Column } from '@/components/ui/datatable';
import { FileUpload } from '@/components/ui/file-upload';

interface CSVRow {
    NADI_SITE: string;
    FULLNAME: string;
    IDENTITY_NO: string;
    IDENTITY_TYPE: string;
    EMAIL: string;
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
}

const CSVUpload: React.FC = () => {
    const [csvData, setCsvData] = useState<CSVRow[]>([]);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const requiredFields = ['NADI_SITE', 'FULLNAME', 'IDENTITY_NO', 'IDENTITY_TYPE', 'EMAIL', 'GENDER'];

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setFileName(file.name);
        if (!file) return;

        setIsProcessing(true);

        try {
            const text = await file.text();
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
        }
    };

    const handleReset = () => {
        setCsvData([]);
        setFileName(null);
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
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Validate Bulk Upload</h1>
                    <p className="text-gray-600 mt-1">
                        Validate member data via CSV file before uploading to the system.
                    </p>
                </div>
            </div>

            {/* Upload Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Validate CSV File
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">

                        {csvData.length === 0 ? (
                            <FileUpload
                                maxFiles={1}
                                acceptedFileTypes=".csv"
                                maxSizeInMB={10}
                                buttonText="Choose CSV File"
                                onChange={handleFileUpload}
                            />
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm text-green-700">Uploaded: {fileName}</p>
                                <button
                                    onClick={handleReset}
                                    className="bg-red-600 text-white px-4 py-1 rounded"
                                >
                                    Reset Upload
                                </button>
                            </div>
                        )}

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
                                        <p className="mt-2"><strong>Required Fields:</strong> NADI_SITE, FULLNAME, IDENTITY_NO, IDENTITY_TYPE, EMAIL, GENDER</p>
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