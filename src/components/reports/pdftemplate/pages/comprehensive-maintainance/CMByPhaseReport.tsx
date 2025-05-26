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
import { MaintenanceData } from "@/hooks/report/use-cm-byphase-pdf-data";

// Define props for the PDF Report
interface CMByPhaseReportPDFProps {
    // Report info
    duspLabel?: string;
    phaseLabel?: string;
    periodType?: string;
    periodValue?: string;

    // Maintainance data
    maintainanceData?: MaintenanceData[];

    // Chart images (generated with html2canvas)
    docketStatusChart?: string;

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
    chartContainer: {
        width: '100%',
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
    }
});

export const CMByPhaseReportPDF = ({
    duspLabel = "",
    phaseLabel = "",
    periodType = "All Time",
    periodValue = "All Records",

    maintainanceData = [],

    docketStatusChart = "",

    mcmcLogo = "",
    duspLogo = "",
    monthFilter = null,
    yearFilter = null,

}: CMByPhaseReportPDFProps) => {


    return (
        <Document>

            {/* Page 1- Maintenance */}
            <Page size="A4" style={styles.page}>

                <PDFHeader
                    mcmcLogo={mcmcLogo}
                    duspLogo={duspLogo}
                />

                <PDFMetaSection
                    reportTitle="6.0 Comprehensive Maintenance"
                    phaseLabel={phaseLabel}
                    periodType={periodType}
                    periodValue={periodValue}
                />

                <PDFSectionTitle title="6.1 MAINTENANCE" />


                <View style={{ flexDirection: "row" }}>
                    <View style={{ ...styles.totalBox, padding: 5, width: 75, marginVertical: 0 }}>
                        <Text style={{ fontSize: 8 }}>Total Docket</Text>
                        <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{maintainanceData?.length || 'XX'}</Text>
                    </View>                        <View style={{ ...styles.totalBox, padding: 5, width: 75, marginVertical: 0, marginLeft: 5 }}>
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

                {/* Number of Docket By Status (Minor and Major) chart */}
                <View style={styles.chartContainer}>
                    {docketStatusChart ? (
                        <Image src={docketStatusChart} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                        <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ccc', borderStyle: 'dashed' }}>
                            <Text>Chart Not Available</Text>
                        </View>
                    )}
                </View>
                <PDFFooter />
            </Page>
            {/* Page 2 - Maintenance */}
            <Page size="A4" style={styles.page}>
                <PDFSectionTitle title="6.1 MAINTENANCE" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, position: "relative" }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ ...styles.totalBox, padding: 5, width: 75, marginVertical: 0 }}>
                            <Text style={{ fontSize: 8 }}>Total Docket</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{maintainanceData?.length || 'XX'}</Text>
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
                            phaseLabel={phaseLabel}
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
