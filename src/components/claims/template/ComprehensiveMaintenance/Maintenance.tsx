import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    pdf,
    Image,
    Link,
} from "@react-pdf/renderer";
import {
    PDFFooter,
    PDFTable,
    PDFSectionTitle,
    PDFAppendixTitlePage,
    PDFPhaseQuarterInfo,
    PDFMetaSection,
    PDFHeader
} from "../component/pdf-component";
// Import the actual data fetching functions, not hooks
import { fetchPhaseData } from "@/hooks/use-phase";
import fetchMaintenanceData from "./hook/use-maintenance-data";
// Import PDF utilities
import { generatePdfFilename } from "../component/pdf-utils";
import { generateMaintenanceChartImage } from "./chart/generateMaintenanceChartImage";


const styles = StyleSheet.create({
    page: {
        padding: 40,
        paddingBottom: 80, // <-- Increased bottom padding to avoid overlap with footer
        fontSize: 10,
        fontFamily: "Helvetica",
        position: "relative",
    },
    totalBox: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "solid",
        textAlign: "center",
        fontSize: 8,
        padding: 10,
        width: 70
    },
    attachmentContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    attachmentTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    imageAttachment: {
        width: '100%',
        marginBottom: 20,
    },
});

type MaintenanceProps = {
    duspFilter?: string | number;
    phaseFilter?: string | number | null;
    tpFilter?: string | number;
    nadiFilter?: (string | number)[];
    startDate?: string | null;
    endDate?: string | null;
    claimType?: string | null; //monthly/quarter/yearly
    quater?: string | null; //optional, used for quarterly reports
    header?: boolean; // Optional header for the PDF
    dusplogo?: string | null; // Optional DUSP logo
};

// Convert to an async function that returns a File object
const Maintenance = async ({
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
    startDate = null,
    endDate = null,
    claimType = null,
    quater = null,
    header = false,
    dusplogo = null

}: MaintenanceProps): Promise<File> => {
    // Fetch Maintenance data based on filters
    const { maintenance } = await fetchMaintenanceData({
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });
    console.log("Maintenance data:", maintenance);

    // Generate chart image (base64 PNG) for PDF
    let chartImage: string | null = null;
    if (typeof window !== 'undefined' && maintenance.length > 0) {
        try {
            chartImage = await generateMaintenanceChartImage(maintenance);
        } catch (e) {
            console.error('Failed to generate chart image', e);
        }
    }

    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    console.log("Phase data:", phase);
    const phaseLabel = phase?.name || "All Phases";    // Define the PDF document (only the main report pages)
    const MaintenanceDoc = (
        <Document>
            {/* Page 1: maintenance */}
            <Page size="A4" style={styles.page}>

                {header && (
                    <>
                        <PDFHeader
                            mcmcLogo={"/MCMC_Logo.png"} // Replace with actual MCMC logo if needed
                            duspLogo={dusplogo} // Use provided DUSP logo or placeholder
                        />


                        <PDFMetaSection
                            reportTitle="6.0 Comprehensive Maintenance"
                            phaseLabel={phaseLabel}
                            claimType={claimType}
                            quater={quater}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </>
                )}

                <PDFSectionTitle title="6.1 MAINTENANCE" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                    <View style={{ alignSelf: "flex-start", flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                        <View style={{ alignSelf: "flex-start", flexDirection: "row", justifyContent: "space-between", gap: 5 }}>
                            <View style={{ ...styles.totalBox }}>
                                {/* total NADI sites with maintenance */}
                                <Text>Total{"\n"}NADI</Text>
                                <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{maintenance.length}</Text>
                            </View>
                            <View style={{ ...styles.totalBox }}>
                                {/*total new maintenance  */}
                                <Text>Docket{"\n"}New</Text>
                                <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{maintenance.filter(v => v.docket_status?.toLowerCase() === "new").length}</Text>
                            </View>
                            <View style={{ ...styles.totalBox }}>
                                {/* total In Progress maintenance */}
                                <Text>Docket{"\n"}In Progress</Text>
                                <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{maintenance.filter(v => v.docket_status?.toLowerCase() === "in progress").length}</Text>
                            </View>
                            <View style={{ ...styles.totalBox }}>
                                {/* total close maintenance */}
                                <Text>Docket{"\n"}Close</Text>
                                <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{maintenance.filter(v => v.docket_status?.toLowerCase() === "closed").length}</Text>
                            </View>
                        </View>
                    </View>
                    {!header && (
                        <View style={{ alignSelf: "flex-end" }}>
                            {/* when header not provided, show phase and quarter info */}

                            <PDFPhaseQuarterInfo
                                phaseLabel={phaseLabel}
                                claimType={claimType}
                                quater={quater}
                                startDate={startDate}
                                endDate={endDate}
                            />

                        </View>
                    )}
                </View>

                {/* maintaince chart here */}
                {chartImage && (
                    <Image
                        src={chartImage}
                        style={{ width: 500, height: 300, margin: '0 auto', marginBottom: 20 }}
                    />
                )}

                <PDFFooter /> {/* Keep as fixed, but paddingBottom prevents overlap */}
            </Page>
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="6.1 MAINTENANCE" />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ alignSelf: "flex-start", flexDirection: "row", justifyContent: "space-between", gap: 5 }}>
                        <View style={{ ...styles.totalBox }}>
                            {/* total NADI sites with maintenance */}
                            <Text>Total{"\n"}NADI</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{maintenance.length}</Text>
                        </View>
                        <View style={{ ...styles.totalBox }}>
                            {/* total NADI sites with maintenance */}
                            <Text>Docket{"\n"}New</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{maintenance.filter(v => v.docket_status?.toLowerCase() === "new").length}</Text>
                        </View>
                        <View style={{ ...styles.totalBox }}>
                            {/* total In Progress maintenance */}
                            <Text>Docket{"\n"}In Progress</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{maintenance.filter(v => v.docket_status?.toLowerCase() === "in progress").length}</Text>
                        </View>
                        <View style={{ ...styles.totalBox }}>
                            {/* total NADI sites with maintenance */}
                            <Text>Docket{"\n"}Close</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{maintenance.filter(v => v.docket_status?.toLowerCase() === "closed").length}</Text>
                        </View>
                    </View>
                    {/* {!header && ( */}
                    <View style={{ alignSelf: "flex-end" }}>
                        {/* when header not provided, show phase and quarter info */}

                        <PDFPhaseQuarterInfo
                            phaseLabel={phaseLabel}
                            claimType={claimType}
                            quater={quater}
                            startDate={startDate}
                            endDate={endDate}
                        />

                    </View>
                    {/* )} */}
                </View>
                {maintenance.length > 0 ? (
                    <PDFTable
                        data={maintenance}
                        columns={[
                            { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                            { key: "standard_code", header: "REFID" },
                            { key: "site_name", header: "NADI" },
                            { key: "state", header: "STATE" },
                            { key: "docket_type", header: "TYPE" },
                            { key: "docket_issue", header: "ISSUE" },
                            { key: "docket_SLA", header: "SLA" },
                            { key: "docket_duration", header: "DURATION", width: "15%" },
                            { key: "docket_open", header: "DOCKET\nOPEN" },
                            { key: "docket_close", header: "DOCKET\nCLOSE" }
                        ]}
                    />
                ) : (
                    <Text>No Maintenance data available.</Text>
                )}

                <PDFFooter /> {/* Keep as fixed, but paddingBottom prevents overlap */}
            </Page>

        </Document>
    );
    // Create a blob from the PDF document (main report and appendix title page)
    const reportBlob = await pdf(MaintenanceDoc).toBlob();

    // Generate filename based on filters
    const fileName = generatePdfFilename('maintenance-report', claimType, phase?.name);

    // Convert blob to File object with metadata
    return new File([reportBlob], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default Maintenance;