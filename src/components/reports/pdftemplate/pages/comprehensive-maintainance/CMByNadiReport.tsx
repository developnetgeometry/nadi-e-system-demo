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
    PDFTable,
    PDFSectionTitle,
    PDFAppendixTitlePage,
    PDFPhaseQuarterInfo,
    PDFInfoTable
} from "../../components/PDFComponents";
import { MaintenanceData, SiteInfo, SupervisorInfo } from "@/hooks/report/use-cm-bynadi-pdf-data";

// Define props for the PDF Report
interface CMByNadiReportPDFProps {
    // Report info
    duspLabel?: string;
    periodType?: string;
    periodValue?: string;

    // Maintainance data
    maintainanceData?: MaintenanceData[];
    siteInfo?: SiteInfo;
    supervisorInfo?: SupervisorInfo;

    // Logos
    mcmcLogo?: string;
    duspLogo?: string;

    // Filter values
    monthFilter?: string | number | null;
    yearFilter?: string | number | null;
    quarter?: number | string | null;
    year?: number | string | null;
}

// PDF styles forTraining report
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: "Helvetica",
        position: "relative",
    },
    totalBox: {
        padding: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "solid",
        textAlign: "center",
        fontSize: 12,
        width: 170
    },
});

export const CMByNadiReportPDF = ({
    duspLabel = "",
    periodType = "All Time",
    periodValue = "All Records",

    maintainanceData = [],
    siteInfo = undefined,
    supervisorInfo = undefined,

    mcmcLogo = "",
    duspLogo = "",
    monthFilter = null,
    yearFilter = null,

}: CMByNadiReportPDFProps) => {

    // Report information data
    const reportInfoData = [
        { label: "REPORT", value: "6.0 Comprehensive Maintenance" },
        { label: "MONTH", value: monthFilter?.toString() || "-" },
        { label: "YEAR", value: yearFilter?.toString() || "ALL Year" }
    ];

    // Site information data
    const siteInfoData = [
        { label: "SITE NAME", value: siteInfo.siteName },
        { label: "REFID / SITECODE", value: siteInfo.refId },
        { label: "PHASE", value: siteInfo.phase },
        { label: "REGION", value: siteInfo.region },
        { label: "STATE", value: siteInfo.state },
        { label: "PARLIAMENT", value: siteInfo.parliament },
        { label: "DUN", value: siteInfo.dun }
    ];

    // Supervisor information data
    const supervisorInfoData = [
        { label: "MANAGER", value: supervisorInfo.manager },
        { label: "MOBILE NO.", value: supervisorInfo.managerMobile },
        { label: "ASSISTANT MANAGER", value: supervisorInfo.assistantManager },
        { label: "MOBILE NO.", value: supervisorInfo.assistantManagerMobile }
    ];

    return (
        <Document>
            {/* Page 1 - NADI Info */}
            <Page size="A4" style={styles.page}>
                <PDFHeader mcmcLogo={mcmcLogo} duspLogo={duspLogo} />

                {/* Report Information Table */}
                <PDFInfoTable
                    title="REPORT INFORMATION"
                    data={reportInfoData}
                />

                {/* Site Information Table */}
                <PDFInfoTable
                    title="SITE INFORMATION"
                    data={siteInfoData}
                />

                {/* Site Supervisor Information Table */}
                <PDFInfoTable
                    title="SITE SUPERVISOR INFORMATION"
                    data={supervisorInfoData}
                />

                <PDFFooter />
            </Page>

            {/* Page 2 - Maintenance */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="6.1 MAINTENANCE" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, position: "relative" }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ ...styles.totalBox, padding: 5, width: 75, marginVertical: 0 }}>
                            <Text style={{ fontSize: 8 }}>Total Docket</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{0 || 'XX'}</Text>
                        </View>
                        <View style={{ ...styles.totalBox, padding: 5, width: 75, marginVertical: 0, marginLeft: 5 }}>
                            <Text style={{ fontSize: 8 }}>Docket Existing</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{0 || 'XX'}</Text>
                        </View>
                        <View style={{ ...styles.totalBox, padding: 5, width: 75, marginVertical: 0, marginLeft: 5 }}>
                            <Text style={{ fontSize: 8 }}>Docket New</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{0 || 'XX'}</Text>
                        </View>
                        <View style={{ ...styles.totalBox, padding: 5, width: 75, marginVertical: 0, marginLeft: 5 }}>
                            <Text style={{ fontSize: 8 }}>Docket Pending</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{0 || 'XX'}</Text>
                        </View>
                        <View style={{ ...styles.totalBox, padding: 5, width: 75, marginVertical: 0, marginLeft: 5 }}>
                            <Text style={{ fontSize: 8 }}>Docket Close</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{0 || 'XX'}</Text>
                        </View>
                    </View>
                    <View style={{ position: "absolute", bottom: 0, right: 0 }}>
                        <PDFPhaseQuarterInfo
                            phaseLabel={siteInfo.phase}
                            periodType={periodType}
                            periodValue={periodValue}
                        />
                    </View>
                </View>
                {/* TABLE */}
                <PDFTable
                    data={maintainanceData.slice(0, 20)}
                    columns={[
                        { header: "NO", key: (_, i) => `${i + 1}.`, width: "5%" },
                        { header: "TYPE", key: "type" },
                        { header: "ISSUE", key: "issue" },
                        { header: "SLA", key: "SLA" },
                        { header: "DURATION(DAY)", key: "Duration" },
                        { header: "DOCKET OPEN", key: "Opened" },
                        { header: "DOCKET CLOSE", key: "Closed" },
                    ]}
                />

                <PDFFooter />
            </Page>
        </Document>
    );
};
