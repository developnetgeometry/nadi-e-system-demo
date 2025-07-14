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
import fetchManageInternetServiceData from "./hook/use-manage-data";
// Import PDF utilities
import { generatePdfFilename } from "../component/pdf-utils";


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

type ManageInternetServiceProps = {
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
    uploadAttachment?: File | null; // Optional attachment file
    
};

// Convert to an async function that returns a File object
const ManageInternetService = async ({
    duspFilter = null,
    phaseFilter = null,
    nadiFilter = [],
    tpFilter = null,
    startDate = null,
    endDate = null,
    claimType = null,
    quater = null,
    header = false,
    dusplogo = null,
    uploadAttachment = null

}: ManageInternetServiceProps): Promise<File> => {
    // Fetch ManageInternetService data based on filters
    const { manage } = await fetchManageInternetServiceData({
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });
    console.log("Manage data:",manage);

    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    console.log("Phase data:", phase);
    const phaseLabel = phase?.name || "All Phases";    // Define the PDF document (only the main report pages)
    const ManageInternetServiceDoc = (
        <Document>
            {/* Page 1: ManageInternetService */}
            <Page size="A4" style={styles.page}>

                {header && (
                    <>
                        <PDFHeader
                            mcmcLogo={"/MCMC_Logo.png"} // Replace with actual MCMC logo if needed
                            duspLogo={dusplogo} // Use provided DUSP logo or placeholder
                        />


                        <PDFMetaSection
                            reportTitle="4.0 INTERNET ACCESS"
                            phaseLabel={phaseLabel}
                            claimType={claimType}
                            quater={quater}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </>
                )}

                <PDFSectionTitle title="4.1 MANAGED INTERNET ACCESS" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                    <View style={styles.totalBox}>
                        {/* total NADI sites with MANAGE */}
                        <Text>Total NADI{"\n"}</Text>
                        <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{manage.length}</Text>
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

                {manage.length > 0 ? (
                    <PDFTable
                        data={manage}
                        columns={[
                            { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                            { key: "standard_code", header: "REFID" },
                            { key: "site_name", header: "NADI" },
                            { key: "state", header: "STATE" },
                            { key: "technology", header: "TECHNOLOGY" },
                            { key: "bandwidth", header: "BANDWIDTH" }
                        ]}
                    />
                ) : (
                    <Text>No manage data available.</Text>
                )}
                <PDFFooter /> {/* Keep as fixed, but paddingBottom prevents overlap */}
            </Page>
        </Document>
    );
    // Create a blob from the PDF document (main report and appendix title page)
    const reportBlob = await pdf(ManageInternetServiceDoc).toBlob();



    // Generate filename based on filters
    const fileName = generatePdfFilename('manage-internet-service-report', claimType, phase?.name);

    // Convert blob to File object with metadata
    return new File([reportBlob], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default ManageInternetService;