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
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 60,
  },
  titleSection: {
    textAlign: "center",
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 10,
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  cellLabel: {
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: "bold",
    paddingVertical: 6,
    paddingHorizontal: 8,
    width: "25%",
  },
  cellValue: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderColor: "#000",
    width: "25%",
  },
  body: {
    paddingTop: 40,
  },
  bigText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 6,
  },
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
  footerText: {
    fontSize: 9,
    color: "#666",
  },
});

type InternetAccessReportProps = {
  duspLabel?: string;
  phaseLabel?: string;
  monthLabel?: string;
  year?: string;
  totalConnected: number;
  showMonth?: boolean;
  mcmcLogo: string; // base64 or url
  duspLogo: string; // base64 or url
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

      {/* Main Content */}
      <View style={styles.body}>
        <Text>Total NADI sites with internet access:</Text>
        <Text style={styles.bigText}>{totalConnected}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>
          This document is system-generated from e-System.
        </Text>
      </View>
    </Page>
  </Document>
);
