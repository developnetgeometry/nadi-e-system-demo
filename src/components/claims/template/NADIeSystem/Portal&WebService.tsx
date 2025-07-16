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
import fetchPortalWebServiceData from "./hook/use-portal-web-service-data";

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

type PortalWebServiceProps = {
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
const PortalWebService = async ({
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

}: PortalWebServiceProps): Promise<File> => {
    // Fetch PortalWebService data based on filters
    const { portalWebService } = await fetchPortalWebServiceData({
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });
    console.log("PortalWebService data:",portalWebService);

    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    console.log("Phase data:", phase);
    const phaseLabel = phase?.name || "All Phases";    // Define the PDF document (only the main report pages)
    const PortalWebServiceDoc = (
        <Document>
            {/* Page 1: PortalWebService */}
            <Page size="A4" style={styles.page}>

                {header && (
                    <>
                        <PDFHeader
                            mcmcLogo={"/MCMC_Logo.png"} // Replace with actual MCMC logo if needed
                            duspLogo={dusplogo} // Use provided DUSP logo or placeholder
                        />


                        <PDFMetaSection
                            reportTitle="3.0 NADI E-System"
                            phaseLabel={phaseLabel}
                            claimType={claimType}
                            quater={quater}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </>
                )}

                <PDFSectionTitle title="3.2 PORTAL & WEB SERVICES (EMAIL)" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                    <View style={styles.totalBox}>
                        {/* total NADI sites with PortalWebService */}
                        <Text>Total NADI{"\n"}</Text>
                        <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{portalWebService.length}</Text>
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

                {portalWebService.length > 0 ? (
                    <PDFTable
                        data={portalWebService}
                        columns={[
                            { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                            { key: "standard_code", header: "REFID", width: "15%" },
                            { key: "site_name", header: "NADI", width: "25%" },
                            { key: "state", header: "STATE", width: "12%" },
                            { 
                                key: "site_url_web_portal",
                                header: "URL PORTAL", 
                                width: "28%",
                                align: "left",
                                render: (value) => value ? (
                                    <Link src={value.startsWith('http') ? value : `https://${value}`}>
                                        {value}
                                    </Link>
                                ) : "-"
                            },
                            { 
                                key: "website_last_updated",
                                header: "LAST UPDATED", 
                                width: "15%",
                                align: "center",
                                render: (value) => value ? new Date(value).toLocaleDateString() : "-"
                            },
                        ]}
                    />
                ) : (
                    <Text>No portalWebService data available.</Text>
                )}
                <PDFFooter /> {/* Keep as fixed, but paddingBottom prevents overlap */}
            </Page>
        </Document>
    );
    // Create a blob from the PDF document (main report and appendix title page)
    const reportBlob = await pdf(PortalWebServiceDoc).toBlob();

    // Generate filename based on filters
    const fileName = generatePdfFilename('portal-web-service-report', claimType, phase?.name);

    // Convert blob to File object with metadata
    return new File([reportBlob], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default PortalWebService;