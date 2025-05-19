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
import {
  PDFHeader,
  PDFFooter,
  PDFMetaSection,
  PDFTable,
  PDFSectionTitle
} from "../../components/PDFComponents";

// PDF styles - only keeping what's necessary
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    position: "relative",
  },
  box: {
    padding: 20,
    backgroundColor: "#fff",
    border: "1pt solid #000",
    marginBottom: 10,
    marginTop: 5,
    maxWidth: 170,
    textAlign: "center",
    fontSize: 12,
  }
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
  <Document>    <Page size="A4" style={styles.page}>
    {/* Header Component */}
    <PDFHeader mcmcLogo={mcmcLogo} duspLogo={duspLogo} />

    {/* Meta Section Component */}
    <PDFMetaSection
      reportTitle="4.0 Internet Access"
      phaseLabel={phaseLabel}
      periodType={showMonth ? "MONTH / YEAR" : "QUARTER / YEAR"}
      periodValue={showMonth && monthLabel ? `${monthLabel} / ${year}` : `4 / ${year}`}
    />    {/* Section 4.1 */}
    <PDFSectionTitle title="4.1 MANAGED INTERNET SERVICES" />
    <Text style={styles.box}>Total NADI{"\n"}{totalConnected}</Text>{/* Table Component */}    <PDFTable
      data={nadiSites}
      columns={[
        {
          key: (_, i) => `${i + 1}.`,
          header: "No",
          width: "5%" // Fixed narrow width for number column
        },
        {
          key: "name",
          header: "NADI",
          width: "30%" // The widest column for site names
        },
        {
          key: "state",
          header: "STATE",
          width: "20%" // Fixed width for state names
        },
        {
          key: "technology",
          header: "TECHNOLOGY",
          width: "25%" // Slightly wider for technology names
        },
        {
          key: "bandwidth",
          header: "BANDWIDTH",
          width: "20%" // Fixed width for bandwidth values
        },
      ]}
    />{/* Footer Component */}
    <PDFFooter />
  </Page>    {/* Page 2 */}
    <Page size="A4" style={styles.page}>
      <PDFSectionTitle title="4.2 NMS" />
      <Text>1. TP will upload a report as attachment</Text>
      <Text>2. Report display here</Text>
      <PDFFooter />
    </Page>    {/* Page 3 */}
    <Page size="A4" style={styles.page}>
      <PDFSectionTitle title="4.3 MONITORING & REPORTING" />
      <Text>1. TP will upload a report as attachment</Text>
      <Text>2. Report display here</Text>
      <PDFFooter />
    </Page>    {/* Page 4 */}
    {graphImage && (
      <Page size="A4" style={styles.page}>
        <PDFSectionTitle title="4.4 INTERNET ACCESS CHART" />
        <Text style={{ fontSize: 10, marginBottom: 10 }}>
          Visual representation of internet-enabled NADI sites.
        </Text>
        <Image
          src={graphImage}
          style={{ width: "100%", height: 300, objectFit: "contain" }}
        />
        <PDFFooter />
      </Page>
    )}
  </Document>
);
