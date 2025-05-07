import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { Site } from "@/components/site/hook/site-utils";

interface Service {
  id: number | string;
  name: string;
  status: string;
  type: string;
  users: number;
  lastUpdated: string;
  location: string;
}

interface Product {
  id: number | string;
  name: string;
  sku: string;
  category: string;
  price: string | number;
  stock: string | number;
  status: string;
  location?: string;
}

interface Transaction {
  id: string;
  user: string;
  avatar: string;
  description: string;
  amount: number;
  type: string;
  date: string;
  status: string;
  paymentMethod: string;
}

interface Claim {
  id: string;
  claimant: string;
  claimType: string;
  amount: string;
  submittedDate: string;
  status: string;
  priority?: string;
  approvedDate?: string;
  rejectedDate?: string;
  approvedBy?: string;
  rejectedBy?: string;
  reason?: string;
}

export const exportToPDF = (
  services: Service[],
  title: string = "Services Report"
) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Add date
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  // Create table
  const tableColumn = [
    "ID",
    "Name",
    "Type",
    "Status",
    "Users",
    "Last Updated",
    "Location",
  ];
  const tableRows = services.map((service) => [
    typeof service.id === "number"
      ? `S${String(service.id).padStart(3, "0")}`
      : service.id,
    service.name,
    service.type,
    service.status,
    service.users.toString(),
    service.lastUpdated,
    service.location,
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    theme: "striped",
    headStyles: {
      fillColor: [88, 80, 236],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, "_")}.pdf`);
};

export const exportToCSV = (data: Record<string, any>[], filename: string) => {
  if (!data || !data.length) {
    console.error("No data to export");
    return;
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);

  // Create CSV content with headers as first row
  const csvContent = [
    headers.join(","), // Header row
    ...data.map(row => 
      headers.map(header => {
        // Convert cell value to string and handle special characters
        const cellValue = (row[header] === null || row[header] === undefined) 
          ? '' 
          : String(row[header]);
          
        // Escape quotes and wrap in quotes if the value contains comma, quote or newline
        if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
          return `"${cellValue.replace(/"/g, '""')}"`;
        }
        return cellValue;
      }).join(",")
    )
  ].join("\n");

  // Create a Blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  // Create download link and trigger download
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatDateForExport = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (e) {
    console.error("Invalid date format:", date);
    return '';
  }
};

export const exportFinancialToPDF = (
  transactions: Transaction[],
  title: string = "Financial Report"
) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Add date
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  // Create table
  const tableColumn = [
    "Transaction ID",
    "User",
    "Description",
    "Amount",
    "Type",
    "Date",
    "Status",
    "Payment Method",
  ];
  const tableRows = transactions.map((tx) => [
    tx.id,
    tx.user,
    tx.description,
    `RM ${tx.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`,
    tx.type,
    tx.date,
    tx.status,
    tx.paymentMethod,
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    theme: "striped",
    headStyles: {
      fillColor: [88, 80, 236],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, "_")}.pdf`);
};

export const exportFinancialToCSV = (
  transactions: Transaction[],
  title: string = "financial_report"
) => {
  // Header row
  const header = [
    "Transaction ID",
    "User",
    "Description",
    "Amount",
    "Type",
    "Date",
    "Status",
    "Payment Method",
  ];

  // Format data rows
  const dataRows = transactions.map((tx) => [
    tx.id,
    tx.user,
    tx.description,
    `RM ${tx.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`,
    tx.type,
    tx.date,
    tx.status,
    tx.paymentMethod,
  ]);

  // Combine header and data rows
  const csvContent = [
    header.join(","),
    ...dataRows.map((row) => row.join(",")),
  ].join("\n");

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `${title}.csv`);
};

export const exportMembersToPDF = (
  members: any[],
  title: string = "Members Report"
) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Add date
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  // Create table
  const tableColumn = [
    "ID",
    "Name",
    "Email",
    "Phone",
    "Status",
    "Site",
    "Phase",
    "State",
    "Registration Date",
  ];
  const tableRows = members.map((member) => [
    member.id,
    member.name,
    member.email,
    member.phone || "-",
    member.status,
    member.site,
    member.phase,
    member.state,
    member.registrationDate,
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    theme: "striped",
    headStyles: {
      fillColor: [88, 80, 236],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, "_")}.pdf`);
};

export const exportMembersToCSV = (
  members: any[],
  title: string = "members_report"
) => {
  // Header row
  const header = [
    "ID",
    "Name",
    "Email",
    "Phone",
    "Status",
    "Site",
    "Phase",
    "State",
    "Registration Date",
  ];

  // Format data rows
  const dataRows = members.map((member) => [
    member.id,
    member.name,
    member.email,
    member.phone || "-",
    member.status,
    member.site,
    member.phase,
    member.state,
    member.registrationDate,
  ]);

  // Combine header and data rows
  const csvContent = [
    header.join(","),
    ...dataRows.map((row) =>
      row
        .map((cell) =>
          // Handle cells that might contain commas by wrapping them in quotes
          typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell
        )
        .join(",")
    ),
  ].join("\n");

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `${title}.csv`);
};

export const exportProductsToPDF = (
  products: Product[],
  title: string = "Products Report"
) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Add date
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  // Create table
  const tableColumn = [
    "ID",
    "Name",
    "SKU",
    "Category",
    "Price",
    "Stock",
    "Status",
    "Location",
  ];
  const tableRows = products.map((product) => [
    typeof product.id === "number"
      ? `P${String(product.id).padStart(3, "0")}`
      : product.id,
    product.name,
    product.sku,
    product.category,
    typeof product.price === "number"
      ? `RM ${product.price.toFixed(2)}`
      : product.price,
    product.stock.toString(),
    product.status,
    product.location || "Main Store",
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    theme: "striped",
    headStyles: {
      fillColor: [88, 80, 236],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, "_")}.pdf`);
};

export const exportProductsToCSV = (
  products: Product[],
  title: string = "products_report"
) => {
  // Header row
  const header = [
    "ID",
    "Name",
    "SKU",
    "Category",
    "Price",
    "Stock",
    "Status",
    "Location",
  ];

  // Format data rows
  const dataRows = products.map((product) => [
    typeof product.id === "number"
      ? `P${String(product.id).padStart(3, "0")}`
      : product.id,
    product.name,
    product.sku,
    product.category,
    typeof product.price === "number"
      ? `RM ${product.price.toFixed(2)}`
      : product.price,
    product.stock.toString(),
    product.status,
    product.location || "Main Store",
  ]);

  // Combine header and data rows
  const csvContent = [
    header.join(","),
    ...dataRows.map((row) => row.join(",")),
  ].join("\n");

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `${title}.csv`);
};

export const exportClaimsToPDF = (
  claims: Claim[],
  title: string = "Claims Report"
) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Add date
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  // Create table
  const tableColumn = [
    "Claim ID",
    "Claimant",
    "Type",
    "Amount",
    "Submission Date",
    "Status",
    "Priority",
  ];
  const tableRows = claims.map((claim) => [
    claim.id,
    claim.claimant,
    claim.claimType,
    claim.amount,
    claim.submittedDate,
    claim.status,
    claim.priority || "N/A",
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    theme: "striped",
    headStyles: {
      fillColor: [88, 80, 236],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, "_")}.pdf`);
};

export const exportClaimsToCSV = (
  claims: Claim[],
  title: string = "claims_report"
) => {
  // Header row
  const header = [
    "Claim ID",
    "Claimant",
    "Type",
    "Amount",
    "Submission Date",
    "Status",
    "Priority",
  ];

  // Format data rows
  const dataRows = claims.map((claim) => [
    claim.id,
    claim.claimant,
    claim.claimType,
    claim.amount,
    claim.submittedDate,
    claim.status,
    claim.priority || "N/A",
  ]);

  // Combine header and data rows
  const csvContent = [
    header.join(","),
    ...dataRows.map((row) => row.join(",")),
  ].join("\n");

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `${title}.csv`);
};

export const exportSitesToCSV = (
  sites: Site[],
  states: any[],
  title: string = "sites_report"
) => {
  // Header row
  const header = [
    "No.",
    "Site Code",
    "Site Name",
    "Phase",
    "Region",
    "State",
    "TP (DUSP)",
    "Status",
    "Visibility"
  ];

  // Format data rows
  const dataRows = sites.map((site, index) => {
    // Get state name
    const stateName = site.nd_site_address && site.nd_site_address.length > 0
      ? states.find(s => s.id === site.nd_site_address[0]?.state_id)?.name || ""
      : "";
      
    return [
      (index + 1).toString(),
      site.nd_site[0]?.standard_code || "",
      site.sitename || "",
      site.nd_phases?.name || "",
      site.nd_region?.eng || "",
      stateName,
      site.dusp_tp?.name || "",
      site.nd_site_status?.eng || "",
      site.is_active ? "Active" : "Inactive"
    ];
  });

  // Combine header and data rows
  const csvContent = [
    header.join(","),
    ...dataRows.map((row) =>
      row
        .map((cell) =>
          // Handle cells that might contain commas by wrapping them in quotes
          typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell
        )
        .join(",")
    ),
  ].join("\n");

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `${title}.csv`);
};

export const exportSiteClosureToCSV = (
  closureData: Record<string, any>[],
  title: string = "site_closure_report"
) => {
  if (!closureData || !Array.isArray(closureData) || closureData.length === 0) {
    console.error("No data to export");
    return;
  }

  // Process the data to ensure we handle any potential null/undefined values
  const processedData = closureData.map(row => {
    const newRow = { ...row };
    // Convert any null values to empty strings
    Object.keys(newRow).forEach(key => {
      if (newRow[key] === null || newRow[key] === undefined) {
        newRow[key] = "";
      }
    });
    return newRow;
  });

  try {
    // Combine all rows into CSV format
    const csvContent = convertToCSV(processedData);

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${title}.csv`);
  } catch (error) {
    console.error("Error exporting data to CSV:", error);
  }
};

// Helper function to convert any array of objects to CSV
function convertToCSV(objArray: Record<string, any>[]) {
  // Get all unique headers from all objects
  const headers = objArray.reduce((allHeaders, obj) => {
    Object.keys(obj).forEach(header => {
      if (!allHeaders.includes(header)) {
        allHeaders.push(header);
      }
    });
    return allHeaders;
  }, [] as string[]);

  // Create header row
  let csv = headers.join(',') + '\n';

  // Add rows
  objArray.forEach(obj => {
    const row = headers.map(header => {
      // Get value or empty string if not exists
      let value = obj[header] !== undefined ? obj[header] : '';
      
      // If value contains commas, quotes, or newlines, wrap it in quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        // Replace any double quotes with two double quotes
        value = value.replace(/"/g, '""');
        // Wrap in quotes
        value = `"${value}"`;
      }
      
      return value;
    }).join(',');
    
    csv += row + '\n';
  });

  return csv;
}
