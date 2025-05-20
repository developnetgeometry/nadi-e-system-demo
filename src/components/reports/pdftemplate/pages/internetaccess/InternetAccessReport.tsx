import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from "@react-pdf/renderer";
import {
  PDFHeader,
  PDFFooter,
  PDFMetaSection,
  PDFSectionTitle,
  PDFTable,
  PDFPhaseQuarterInfo
} from "../../components/PDFComponents";

// Define Interface for Site data
interface InternetAccessSite {
  id?: string;
  standard_code?: string;
  sitename?: string;
  phase_name?: string;
  has_internet?: boolean;
  connection_type?: string;
  provider?: string;
  speed?: string;
  status?: string;
}

// Define props for the PDF Report
interface InternetAccessReportPDFProps {
  // Report info
  duspLabel?: string;
  phaseLabel?: string;
  periodType?: string;
  periodValue?: string;

  // Data for reports
  sites: InternetAccessSite[];
  totalSites: number;
  sitesWithInternet: number;
  sitesWithoutInternet: number;
  connectionTypes: { type: string; count: number }[];
  providers: { name: string; count: number }[];

  // Logos
  mcmcLogo?: string;
  duspLogo?: string;
  
  // Filter values
  monthFilter?: string | number | null;
  yearFilter?: string | number | null;
  currentMonth?: string | number;
  currentYear?: string | number;
}

// PDF styles for Internet Access report
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    position: "relative",
  },
  totalBox: {
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    marginVertical: 10,
    width: "20%",
    alignItems: "center"
  },
  sectionTitle: {
    backgroundColor: "#000",
    padding: 5,
  },
  sectionTitleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#000",
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  tableHeaderCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#fff",
    color: "#fff", 
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#000",
  },
  contentBox: {
    borderWidth: 1, 
    borderColor: "#000", 
    padding: 20, 
    alignItems: "center", 
    justifyContent: "center", 
    marginTop: 10, 
    minHeight: 300
  },
  warningText: {
    color: "#ff0000"
  },
  pageBreak: {
    height: 1,
    marginTop: 20,
    marginBottom: 10
  }
});

export const InternetAccessReportPDF: React.FC<InternetAccessReportPDFProps> = ({
  duspLabel = "",
  phaseLabel = "All Phases",
  periodType = "All Time",
  periodValue = "All Records",
  sites = [],
  totalSites = 0,
  sitesWithInternet = 0,
  sitesWithoutInternet = 0,
  connectionTypes = [],
  providers = [],
  mcmcLogo = "",
  duspLogo = "",
  monthFilter = null,
  yearFilter = null,
  currentMonth = null,
  currentYear = new Date().getFullYear()
}) => {
  // Format sites data for the table
  const sitesTableData = sites.map((site, index) => ({
    no: (index + 1).toString(),
    nadi: site.sitename || "",
    state: site.phase_name || "",
    technology: site.connection_type || "ADSL",
    bandwidth: site.speed || "100Mbps",
  }));

  // Get month display name for reporting period
  const getMonthName = (month: string | number | null) => {
    if (month === null) return "";
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (typeof month === 'number' && month >= 1 && month <= 12) {
      return monthNames[month - 1];
    }
    return month.toString();
  };

  // Determine quarter and year display
  const quarter = monthFilter ? Math.ceil(Number(monthFilter) / 3) : "";
  const year = yearFilter || currentYear || new Date().getFullYear();
  const quarterText = quarter ? `${quarter} / ${year}` : `${year}`;
  const monthName = getMonthName(monthFilter || currentMonth);

  return (
    <Document>
      {/* Page 1: Managed Internet Services */}
      <Page size="A4" style={styles.page}>
        {/* Header with logos and title */}
        <PDFHeader
          mcmcLogo={mcmcLogo}
          duspLogo={duspLogo}
        />
        
        {/* Report metadata section */}
        <PDFMetaSection
          reportTitle="4.0 Internet Access"
          phaseLabel={phaseLabel}
          periodType={periodType}
          periodValue={periodValue}
        />   

        {/* Section 1: Managed Internet Services */}
        <View style={{ marginBottom: 20 }}>
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>4.1 MANAGED INTERNET SERVICES</Text>
          </View>

          {/* Total NADI box */}
          <View style={styles.totalBox}>
            <Text style={{ fontWeight: 'bold' }}>Total NADI</Text>
            <Text style={{ fontWeight: 'bold', marginTop: 5 }}>{totalSites}</Text>
          </View>

          {/* Sites Table */}
          <View style={{ borderWidth: 1, borderColor: '#000' }}>
            <View style={styles.tableHeader}>
              <View style={{ width: '5%', ...styles.tableHeaderCell }}>
                <Text>NO</Text>
              </View>
              <View style={{ width: '35%', ...styles.tableHeaderCell }}>
                <Text>NADI</Text>
              </View>
              <View style={{ width: '20%', ...styles.tableHeaderCell }}>
                <Text>STATE</Text>
              </View>
              <View style={{ width: '20%', ...styles.tableHeaderCell }}>
                <Text>TECHNOLOGY</Text>
              </View>
              <View style={{ width: '20%', ...styles.tableHeaderCell, borderRightWidth: 0 }}>
                <Text>BANDWIDTH</Text>
              </View>
            </View>
            
            {sitesTableData.length > 0 ? (
              sitesTableData.map((site, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={{ width: '5%', ...styles.tableCell }}>
                    <Text>{site.no}</Text>
                  </View>
                  <View style={{ width: '35%', ...styles.tableCell }}>
                    <Text>{site.nadi}</Text>
                  </View>
                  <View style={{ width: '20%', ...styles.tableCell }}>
                    <Text>{site.state}</Text>
                  </View>
                  <View style={{ width: '20%', ...styles.tableCell }}>
                    <Text>{site.technology}</Text>
                  </View>
                  <View style={{ width: '20%', ...styles.tableCell, borderRightWidth: 0 }}>
                    <Text>{site.bandwidth}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={{ padding: 10 }}>
                <Text>No data available</Text>
              </View>
            )}
          </View>
        </View>

        <PDFFooter customText="This document is system-generated from e-System." />
      </Page>

      {/* Page 2: NMS */}
      <Page size="A4" style={styles.page}>

        {/* Section 2: NMS */}
        <View style={{ marginBottom: 20 }}>
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>4.2 NMS</Text>
          </View>
          
          <View style={styles.contentBox}>
            <Text style={styles.warningText}>1. TP will upload a report as attachment</Text>
            <Text style={styles.warningText}>2. Report display here</Text>
          </View>
        </View>

        <PDFFooter customText="This document is system-generated from e-System." />
      </Page>

      {/* Page 3: Monitoring & Reporting */}
      <Page size="A4" style={styles.page}>

        {/* Section 3: Monitoring & Reporting */}
        <View>
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>4.3 MONITORING & REPORTING</Text>
          </View>
          
          <View style={styles.contentBox}>
            <Text style={styles.warningText}>1. TP will upload a report as attachment</Text>
            <Text style={styles.warningText}>2. Report display here</Text>
          </View>
        </View>

        <PDFFooter customText="This document is system-generated from e-System." />
      </Page>
    </Document>
  );
};
