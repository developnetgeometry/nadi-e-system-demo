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
import { InternetServiceSite } from "@/hooks/report/use-internet-access-pdf-data";

// Define Interface for Site data


// Define props for the PDF Report
interface InternetAccessReportPDFProps {
  // Report info
  duspLabel?: string;
  phaseLabel?: string;
  periodType?: string;
  periodValue?: string;

  // Data for reports
  internetSite?: InternetServiceSite[];

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
  duspLabel ,
  phaseLabel ,
  periodType,
  periodValue ,
  internetSite= [],
  mcmcLogo = "",
  duspLogo = "",
  monthFilter = null,
  yearFilter = null,
  currentMonth = null,
  currentYear = new Date().getFullYear()
}) => {
  

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
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>4.1 MANAGED INTERNET SERVICES</Text>
        </View>

        {/* Total NADI box */}
        <View style={styles.totalBox}>
          <Text style={{ fontWeight: 'bold' }}>Total NADI</Text>
          <Text style={{ fontWeight: 'bold', marginTop: 5 }}>{internetSite.length}</Text>
        </View>

        {/* Sites Table */}
        {internetSite && internetSite.length > 0 ? (
          <PDFTable
            data={internetSite}
            columns={[
              {
                key: (_, i) => `${i + 1}.`,
                header: "NO",
                width: "5%"
              },
              {
                key: "sitename",
                header: "NADI",
              },
              {
                key: "state",
                header: "STATE",
                width: "20%"
              },
              {
                key: "technology",
                header: "QTY CMS PC CLIENT",
                width: "20%"
              },
              {
                key: "bandwidth",
                header: "DATE INSTALL",
                width: "20%"
              }
            ]}
          />
        ) : (
          <Text>No CMS data available</Text>
        )}

        <PDFFooter />
      </Page>

      {/* Page 2: NMS */}
      <Page size="A4" style={styles.page}>

        {/* Section 2: NMS */}
        <View style={{ marginBottom: 20 }}>
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>4.2 NMS</Text>
          </View>

          <View style={styles.contentBox}>
            <Text style={styles.warningText}>Attachment NMS</Text>
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
            <Text style={styles.warningText}>Attachment MONITORING & REPORTING</Text>
          </View>
        </View>

        <PDFFooter customText="This document is system-generated from e-System." />
      </Page>
    </Document>
  );
};
