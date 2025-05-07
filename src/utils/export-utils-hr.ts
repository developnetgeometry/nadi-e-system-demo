import { saveAs } from "file-saver";

// Function to export data to CSV
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    console.error("No data to export");
    return;
  }

  // Get headers from the first object's keys
  const headers = Object.keys(data[0]);

  // Create CSV rows
  const rows = data.map((item) =>
    headers
      .map((header) => {
        // Handle case where the value might contain commas or quotes
        let value =
          item[header] === null || item[header] === undefined
            ? ""
            : item[header];
        value = String(value).replace(/"/g, '""'); // Escape double quotes

        // If value contains commas, newlines, or double quotes, enclose in double quotes
        if (
          value.includes(",") ||
          value.includes("\n") ||
          value.includes('"')
        ) {
          value = `"${value}"`;
        }
        return value;
      })
      .join(",")
  );

  // Add headers as first row
  const csvContent = [headers.join(","), ...rows].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `${filename}.csv`);
};

// Prepare TP staff data for export by flattening and formatting
export const prepareTPStaffDataForExport = (staffList: any[]) => {
  return staffList.map((staff) => ({
    Name: staff.name || "",
    Email: staff.email || "",
    "Phone Number": staff.phone_number || "",
    "User Type": staff.userType?.replace(/_/g, " ") || "",
    Status: staff.status || "",
    Role: staff.role || "",
    "Employment Date": staff.employDate || "",
    "IC Number": staff.ic_number || "",
    DUSP: staff.dusp || "",
    TP: staff.tp || "",
  }));
};

// Prepare Site staff data for export by flattening and formatting
export const prepareSiteStaffDataForExport = (staffList: any[]) => {
  return staffList.map((staff) => ({
    Name: staff.name || "",
    Email: staff.email || "",
    "Phone Number": staff.phone_number || "",
    "User Type": staff.userType?.replace(/_/g, " ") || "",
    Status: staff.status || "",
    "Employment Date": staff.employDate || "",
    "IC Number": staff.ic_number || "",
    "Site Location": staff.siteLocation || "",
  }));
};

// Function to export TP staff data to CSV
export const exportTPStaffToCSV = (
  staffList: any[],
  filename = "tp-staff-data"
) => {
  const formattedData = prepareTPStaffDataForExport(staffList);
  exportToCSV(formattedData, filename);
};

// Function to export Site staff data to CSV
export const exportSiteStaffToCSV = (
  staffList: any[],
  filename = "site-staff-data"
) => {
  const formattedData = prepareSiteStaffDataForExport(staffList);
  exportToCSV(formattedData, filename);
};

// Function to export site data to CSV
export const exportSitesToCSV = (
  siteList: any[],
  states: any[],
  filename = "site-data"
) => {
  if (!siteList || !siteList.length) {
    console.error("No site data to export");
    return;
  }

  // Prepare sites data for export with proper formatting
  const formattedData = siteList.map((site) => {
    // Get state name from states array
    const stateName =
      site.nd_site_address && site.nd_site_address.length > 0
        ? states.find((s) => s.id === site.nd_site_address[0]?.state_id)
            ?.name || ""
        : "";

    return {
      "Site Name": site.sitename || "",
      "Site Code":
        site.nd_site && site.nd_site[0]
          ? site.nd_site[0].standard_code || ""
          : "",
      Phase: site.nd_phases?.name || "",
      Region: site.nd_region?.eng || "",
      State: stateName,
      DUSP: site.dusp_tp?.parent?.name || "",
      TP: site.dusp_tp?.name || "",
      Status: site.nd_site_status?.eng || "",
      Visibility: site.is_active ? "Active" : "Hidden",
    };
  });

  // Export the formatted data
  exportToCSV(formattedData, filename);
};
