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
import { fetchlocalAuthorityData } from "./hook/use-localAuthority-data";
import { fetchPhaseData } from "@/hooks/use-phase";
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

type LocalAuthorityProps = {
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
    uploadAttachment?: File | null;
};

// Convert to an async function that returns a File object
const LocalAuthority = async ({
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
    uploadAttachment = null,

}: LocalAuthorityProps): Promise<File> => {
    // Fetch local authority data based on filters
    const { localAuthority } = await fetchlocalAuthorityData({
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });

    // console.log("Local Authority data:", localAuthority);

    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    console.log("Phase data:", phase);
    const phaseLabel = phase?.name || "All Phases";    // Define the PDF document (only the main report pages)
    const LocalAuthorityDoc = (
        <Document>
            {/* Page 1: Local Authority */}
            <Page size="A4" style={styles.page}>
                {header && (
                    <>
                        <PDFHeader
                            mcmcLogo={"/MCMC_Logo.png"} // Replace with actual MCMC logo if needed
                            duspLogo={dusplogo} // Use provided DUSP logo or placeholder
                        />
                        <PDFMetaSection
                            reportTitle="2.0 Site Management"
                            phaseLabel={phaseLabel}
                            claimType={claimType}
                            quater={quater}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </>
                )}

                {/* Section 2.1 Local Authority */}
                <PDFSectionTitle title="2.1 LOCAL AUTHORITY" />
                
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ alignSelf: "flex-start", flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                        <View style={{ ...styles.totalBox }}>
                            <Text>Total NADI</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{localAuthority.length}</Text>
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
                
                {/* should be shown all site with or without local authority. status indicate it have or not local authority */}
                {localAuthority.length > 0 ? (
                    <PDFTable
                        data={localAuthority}
                        columns={[
                            { 
                                key: (_, i) => `${i + 1}.`, 
                                header: "NO", 
                                width: "5%",
                                align: "center"
                            },
                            { 
                                key: "standard_code", 
                                header: "REFID",
                                width: "15%"
                            },
                            { 
                                key: "site_name", 
                                header: "NADI",
                                width: "25%"
                            },
                            { 
                                key: "state", 
                                header: "STATE",
                                width: "15%"
                            },
                            { 
                                key: "status", 
                                header: "STATUS",
                                align: "center",
                                render: (value, item) => {
                                    return item.status ? "Yes" : "No";
                                }
                            },
                            { 
                                key: "start_date", 
                                header: "START DATE",
                                align: "center",
                                render: (value, item) => {
                                    return item.start_date ? new Date(item.start_date).toLocaleDateString() : "-";
                                }
                            },
                            { 
                                key: "end_date", 
                                header: "END DATE",
                                align: "center",
                                render: (value, item) => {
                                    return item.end_date ? new Date(item.end_date).toLocaleDateString() : "-";
                                }
                            }
                        ]}
                    />
                ) : (
                    <Text>No local authority data available.</Text>
                )}

                {/* Footer Component */}
                <PDFFooter />
            </Page>
        </Document>

    );
    // Create a blob from the PDF document (main report and appendix title page)
    const reportBlob = await pdf(LocalAuthorityDoc).toBlob();

    // Generate filename based on filters
    const fileName = generatePdfFilename('local-authority-report', claimType, phase?.name);

    // Convert blob to File object with metadata
    return new File([reportBlob], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default LocalAuthority;