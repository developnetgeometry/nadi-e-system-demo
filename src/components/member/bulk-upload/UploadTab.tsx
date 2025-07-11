import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, Download } from 'lucide-react';

const UploadTab: React.FC = () => {

    const expectedHeaders = [
        'NADI_SITE', 'FULLNAME', 'IDENTITY_NO', 'IDENTITY_TYPE', 'EMAIL', 'GENDER',
        'RACE', 'PDPA_DECLARE', 'AGREE_DECLARE', 'ENTREPRENEUR_STATUS', 'GUARDIAN_NAME',
        'ADDRESS1', 'ADDRESS2', 'DISTRICT', 'STATE', 'POSTCODE', 'CITY',
        'NATIONALITY', 'MADANI_COMMUNITY'
    ];

    const downloadTemplate = () => {
        // Create sample data
        const templateData = [
            expectedHeaders,
            [
                '1',                  // NADI_SITE
                'John Doe',           // FULLNAME
                '000111-22-3333',       // IDENTITY_NO
                '1',                  // IDENTITY_TYPE (1 = IC)
                'johndoe@gmail.com',  // EMAIL
                '1',                  // GENDER (1 = Male)
                '1',                  // RACE
                'true',               // PDPA_DECLARE
                'true',               // AGREE_DECLARE
                '1',                  // NATIONALITY
                'Jane Doe',           // GUARDIAN_NAME
                '123 Main Street',    // ADDRESS1
                'Apt 4B',            // ADDRESS2
                '1',                  // DISTRICT
                '1',                  // STATE
                '12345',              // POSTCODE
                'Kuala Lumpur',        // CITY
                'true',               // MADANI_COMMUNITY
                'false'              // ENTREPRENEUR_STATUS
            ],
            [
                '2',                  // NADI_SITE
                'Jane Smith',         // FULLNAME
                '000222-33-4444',       // IDENTITY_NO
                '1',                  // IDENTITY_TYPE
                'janesmith@gmail.com',  // EMAIL
                '2',                  // GENDER (2 = Female)
                '2',                  // RACE
                'true',               // PDPA_DECLARE
                'true',               // AGREE_DECLARE
                '1',                  // NATIONALITY
                'John Smith',         // GUARDIAN_NAME
                '456 Oak Avenue',     // ADDRESS1
                '',                   // ADDRESS2
                '2',                  // DISTRICT
                '1',                  // STATE
                '54321',              // POSTCODE
                'Petaling Jaya',       // CITY
                'false',              // MADANI_COMMUNITY
                'true',               // ENTREPRENEUR_STATUS
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

        </div>
    );
};

export default UploadTab;