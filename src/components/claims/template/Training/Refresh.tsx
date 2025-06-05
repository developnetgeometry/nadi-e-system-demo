import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    pdf,
    Image,
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
import fetchRefreshData from "./hook/use-refresh-data";
// Import PDF utilities
import { generatePdfFilename } from "../component/pdf-utils";


const styles = StyleSheet.create({
    page: {
        padding: 40,
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
        width: 80
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

type RefreshProps = {
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
const Refresh = async ({
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

}: RefreshProps): Promise<File> => {
    // Fetch Refresh data based on filters
    const { refresh } = await fetchRefreshData({
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });
    console.log("Refresh data:", refresh);

    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    console.log("Phase data:", phase);
    const phaseLabel = phase?.name || "All Phases";    // Define the PDF document (only the main report pages)
    const RefreshDoc = (
        <Document>
            {/* Page 1: Refresh */}
            <Page size="A4" style={styles.page}>

                {header && (
                    <>
                        <PDFHeader
                            mcmcLogo={"/MCMC_Logo.png"} // Replace with actual MCMC logo if needed
                            duspLogo={dusplogo} // Use provided DUSP logo or placeholder
                        />


                        <PDFMetaSection
                            reportTitle="5.0 TRAINING"
                            phaseLabel={phaseLabel}
                            claimType={claimType}
                            quater={quater}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </>
                )}

                <PDFSectionTitle title="5.2 REFRESH TRAINING (MANAGER / ASSISTANT MANAGER)" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                    <View style={{ alignSelf: "flex-start", flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                        <View style={styles.totalBox}>
                            {/* total NADI sites with refresh */}
                            <Text>Total NADI{"\n"}</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{Array.from(new Set(refresh.map(item => item.site_id))).length}</Text>
                        </View>
                        <View style={styles.totalBox}>
                            {/* Total number of employee sites with refresh */}
                            <Text>Number of {"\n"} Employee</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{refresh.length}</Text>
                        </View>
                        <View style={styles.totalBox}>
                            {/* Manager sites with refresh */}
                            <Text>Manager{"\n"}</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{refresh.filter(v => v.participant_position === 'Manager').length}</Text>
                        </View>
                        <View style={styles.totalBox}>
                            {/* Assistant Manager sites with refresh */}
                            <Text>Assistant{"\n"}Manager</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{refresh.filter(v => v.participant_position === 'Assistant Manager').length}</Text>
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

                {refresh.length > 0 ? (
                    <PDFTable
                        data={refresh}
                        columns={[
                            { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                            { key: "standard_code", header: "REFID" },
                            { key: "site_name", header: "NADI" },
                            { key: "participant_fullname", header: "FULL NAME" },
                            { key: "participant_position", header: "POSITION" },
                            { key: "programme_name", header: "PROGRAM NAME" },
                            { key: "programme_method", header: "METHOD" },
                            { key: "programme_venue", header: "VENUE" },
                            { key: "training_date", header: "DATE TRAINING" }
                        ]}
                    />
                ) : (
                    <Text>No refresh data available.</Text>
                )}
                <PDFFooter />
            </Page>
        </Document >
    );
    // Create a blob from the PDF document (main report and appendix title page)
    const reportBlob = await pdf(RefreshDoc).toBlob();



    // Generate filename based on filters
    const fileName = generatePdfFilename('refresh-report', claimType, phase?.name);

    // Convert blob to File object with metadata
    return new File([reportBlob], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default Refresh;