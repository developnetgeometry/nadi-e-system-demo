import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import LookupTable from './bulk-upload/LookupTable';

interface UploadResult {
  success: boolean;
  message: string;
  errors?: string[];
  successCount?: number;
  totalCount?: number;
}

const BulkUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample CSV template data
  const templateData = [
    ['Name', 'Email', 'Phone', 'Department', 'Position', 'Salary'],
    ['John Doe', 'john.doe@example.com', '+1234567890', 'IT', 'Developer', '50000'],
    ['Jane Smith', 'jane.smith@example.com', '+1234567891', 'HR', 'Manager', '60000'],
    ['Bob Johnson', 'bob.johnson@example.com', '+1234567892', 'Finance', 'Analyst', '45000']
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
      setResult(null);
    } else {
      alert('Please drop a valid CSV file');
    }
  };

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/template/member_bulk_upload_template.xlsx'; // relative to public folder
    link.download = 'member_bulk_upload_template.xlsx'; // filename when saving
    link.click();
  };


  const parseCSV = (csvText: string): string[][] => {
    const lines = csvText.split('\n');
    return lines.map(line => line.split(',').map(cell => cell.trim()));
  };

  const validateCSVData = (data: string[][]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const requiredColumns = ['Name', 'Email', 'Phone', 'Department', 'Position'];
    
    if (data.length < 2) {
      errors.push('CSV file must contain at least a header and one data row');
      return { isValid: false, errors };
    }

    const headers = data[0];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Validate email format in data rows
    const emailIndex = headers.indexOf('Email');
    if (emailIndex !== -1) {
      for (let i = 1; i < data.length; i++) {
        const email = data[i][emailIndex];
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          errors.push(`Invalid email format in row ${i + 1}: ${email}`);
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const text = await file.text();
      const csvData = parseCSV(text);
      const validation = validateCSVData(csvData);

      if (!validation.isValid) {
        setResult({
          success: false,
          message: 'CSV validation failed',
          errors: validation.errors
        });
        setUploading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate processing result
      const totalRows = csvData.length - 1; // Exclude header
      const successCount = Math.floor(totalRows * 0.9); // 90% success rate for demo

      setResult({
        success: true,
        message: 'Bulk upload completed',
        successCount,
        totalCount: totalRows,
        errors: successCount < totalRows ? [`${totalRows - successCount} records failed to import`] : undefined
      });

    } catch (error) {
      setResult({
        success: false,
        message: 'Error processing file',
        errors: ['Failed to read or process the CSV file']
      });
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">Bulk Upload Members</h2>
          <p className="text-gray-600 mt-2">Upload a CSV file to add multiple members at once</p>
        </div>

        <div className="p-6 space-y-6">
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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Upload CSV File</h3>
            
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Drag and drop your CSV file here, or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  browse to select
                </button>
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-sm text-gray-500">Only CSV files are supported</p>
            </div>

            {file && (
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-800 font-medium">{file.name}</span>
                  <span className="text-gray-500 text-sm">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button
                  onClick={resetUpload}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {file && !result && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload and Process</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Results Section */}
          {result && (
            <div className={`rounded-lg p-4 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start space-x-3">
                {result.success ? (
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className={`font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                    {result.message}
                  </h4>
                  
                  {result.success && result.successCount !== undefined && result.totalCount !== undefined && (
                    <p className="text-green-700 mt-1">
                      Successfully imported {result.successCount} out of {result.totalCount} records
                    </p>
                  )}

                  {result.errors && result.errors.length > 0 && (
                    <div className="mt-3">
                      <p className={`font-medium ${result.success ? 'text-yellow-800' : 'text-red-800'}`}>
                        Issues found:
                      </p>
                      <ul className={`mt-1 space-y-1 ${result.success ? 'text-yellow-700' : 'text-red-700'}`}>
                        {result.errors.map((error, index) => (
                          <li key={index} className="text-sm">• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.success && (
                    <button
                      onClick={resetUpload}
                      className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Upload Another File
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Instructions:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Download the CSV template first to ensure proper formatting</li>
              <li>• Required columns: Name, Email, Phone, Department, Position</li>
              <li>• Optional columns: Salary</li>
              <li>• Email addresses must be valid and unique</li>
              <li>• Phone numbers should include country code</li>
              <li>• Maximum file size: 5MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;