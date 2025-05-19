import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  logo: { width: 80, height: 60 },
  titleSection: { textAlign: "center", flex: 1 },
  title: { fontSize: 14, fontWeight: "bold", textTransform: "uppercase" },

  row: {
    flexDirection: "row",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  cellLabel: {
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: "bold",
    padding: 6,
    borderRightWidth: 1,
    width: "25%",
  },
  cellValue: {
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#000",
    width: "25%",
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  box: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    border: "1pt solid #ccc",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },

  table: { width: "100%", border: "1pt solid #000", marginTop: 10 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: "bold",
  },
  tableRow: { flexDirection: "row", borderBottom: "1pt solid #000" },
  th: { padding: 6, flex: 1, fontSize: 9 },
  td: { padding: 6, flex: 1, fontSize: 9 },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
  },
  footerLine: {
    height: 1,
    backgroundColor: "#aaa",
    opacity: 0.3,
    marginBottom: 4,
  },
  footerText: { fontSize: 9, color: "#666" },
});

type NadiSite = {
  state: string;
  technology: string;
  bandwidth: string;
  name: string;
};

type InternetAccessReportProps = {
  duspLabel?: string;
  phaseLabel?: string;
  monthLabel?: string;
  year?: string;
  totalConnected: number;
  showMonth?: boolean;
  mcmcLogo: string; // base64 or url
  duspLogo: string; // base64 or url
  nadiSites: NadiSite[];
  graphImage?: string;
};

export const InternetAccessReportPDF = ({
  duspLabel,
  phaseLabel,
  monthLabel,
  year,
  totalConnected,
  showMonth = false,
  mcmcLogo,
  duspLogo,
  nadiSites,
  graphImage,
}: InternetAccessReportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image src={mcmcLogo} style={styles.logo} />
        <View style={styles.titleSection}>
          <Text style={styles.title}>THE NATIONAL INFORMATION</Text>
          <Text style={styles.title}>DISSEMINATION CENTRE (NADI)</Text>
        </View>
        <Image src={duspLogo} style={styles.logo} />
      </View>

      {/* Meta Section */}
      <View style={styles.row}>
        <Text style={[styles.cellLabel, { width: "25%" }]}>REPORT</Text>
        <Text style={[styles.cellValue, { width: "75%" }]}>
          4.0 Internet Access
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cellLabel}>PHASE</Text>
        <Text style={styles.cellValue}>{phaseLabel || "-"}</Text>
        <Text style={styles.cellLabel}>
          {showMonth ? "MONTH / YEAR" : "QUARTER / YEAR"}
        </Text>
        <Text style={styles.cellValue}>
          {showMonth && monthLabel ? `${monthLabel} / ${year}` : `4 / ${year}`}
        </Text>
      </View>

      {/* Section 4.1 */}
      <Text style={styles.sectionTitle}>4.1 MANAGED INTERNET SERVICES</Text>
      <Text style={styles.box}>{totalConnected} NADI Sites Connected</Text>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.th}>No</Text>
          <Text style={styles.th}>State</Text>
          <Text style={styles.th}>Technology</Text>
          <Text style={styles.th}>Bandwidth</Text>
          <Text style={styles.th}>NADI Name</Text>
        </View>
        {nadiSites.map((site, i) => (
          <View key={site.name} style={styles.tableRow}>
            <Text style={styles.td}>{i + 1}</Text>
            <Text style={styles.td}>{site.state}</Text>
            <Text style={styles.td}>{site.technology}</Text>
            <Text style={styles.td}>{site.bandwidth}</Text>
            <Text style={styles.td}>{site.name}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>
          This document is system-generated from e-System.
        </Text>
      </View>
    </Page>

    {/* Page 2 */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>4.2 NMS</Text>
      <Text>1. TP will upload a report as attachment</Text>
      <Text>2. Report display here</Text>

      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>
          This document is system-generated from e-System.
        </Text>
      </View>
    </Page>

    {/* Page 3 */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>4.3 MONITORING & REPORTING</Text>
      <Text>1. TP will upload a report as attachment</Text>
      <Text>2. Report display here</Text>

      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>
          This document is system-generated from e-System.
        </Text>
      </View>
    </Page>

    {/* Page 4 */}
    {graphImage && (
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>4.4 INTERNET ACCESS CHART</Text>
        <Text style={{ fontSize: 10, marginBottom: 10 }}>
          Visual representation of internet-enabled NADI sites.
        </Text>
        <Image
          src={graphImage}
          style={{ width: "100%", height: 300, objectFit: "contain" }}
        />

        <View style={styles.footer}>
          <View style={styles.footerLine} />
          <Text style={styles.footerText}>
            This document is system-generated from e-System.
          </Text>
        </View>
      </Page>
    )}
  </Document>
);
