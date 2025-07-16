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
import { fetchInsuranceData } from "./hook/use-insurance-data";
import { fetchPhaseData } from "@/hooks/use-phase";
// Import PDF utilities
import { generatePdfFilename } from "../component/pdf-utils";
import { generateFinalPdf, AttachmentSource } from "../component/pdf-attachment-handler";

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

type InsuranceProps = {
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
const Insurance = async ({
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

}: InsuranceProps): Promise<File> => {
    // Fetch insurance data based on filters
    const { insurance, insuranceTypes } = await fetchInsuranceData({
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });
    console.log("insurance data:", insurance);
    console.log("insurance types from DB:", insuranceTypes);

    // Group insurance data by type, but include ALL sites for each type
    const insuranceByType: Record<string, any[]> = {};
    
    // First, collect all unique sites
    const allSitesMap = new Map();
    insurance.forEach(item => {
        // Store unique sites
        if (!allSitesMap.has(item.site_id)) {
            allSitesMap.set(item.site_id, {
                site_id: item.site_id,
                standard_code: item.standard_code,
                site_name: item.site_name,
                refId: item.refId,
                state: item.state
            });
        }
    });
    
    // For each insurance type from database, create a table with ALL sites
    insuranceTypes.forEach(insuranceTypeObj => {
        const insuranceTypeName = insuranceTypeObj.name;
        insuranceByType[insuranceTypeName] = Array.from(allSitesMap.values()).map(site => {
            // Find if this site has this specific insurance type
            const siteInsurance = insurance.find(item => 
                item.site_id === site.site_id && 
                item.insurance_type === insuranceTypeName
            );
            
            return {
                ...site,
                status: !!siteInsurance?.status,
                duration: siteInsurance?.duration || "",
                start_date: siteInsurance?.start_date || null,
                end_date: siteInsurance?.end_date || null,
                insurance_type: insuranceTypeName
            };
        });
    });

    console.log("Insurance by type (all sites):", insuranceByType);
    console.log("Insurance types from database:", insuranceTypes);

    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    console.log("Phase data:", phase);
    const phaseLabel = phase?.name || "All Phases";    // Define the PDF document (only the main report pages)
    const insuranceDoc = (
        <Document>
            {/* Page 1: Main insurance page with first insurance type */}
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

                <PDFSectionTitle title="2.2 SITE INSURANCE" />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ alignSelf: "flex-start", flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                        <View style={{ ...styles.totalBox }}>
                            <Text>Total Sites</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{allSitesMap.size}</Text>
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

                {/* Show first insurance type on main page */}
                {Object.keys(insuranceByType).length > 0 ? (
                    (() => {
                        const [firstInsuranceType, firstInsuranceList] = Object.entries(insuranceByType)[0];
                        const sitesWithThisInsurance = firstInsuranceList.filter(site => site.status);
                        return (
                            <View style={{ marginTop: 15 }}>
                                <Text style={{ 
                                    fontSize: 10, 
                                    fontWeight: "bold", 
                                    marginBottom: 5,
                                    textTransform: "uppercase" 
                                }}>
                                    {firstInsuranceType} INSURANCE 
                                    {/* ({sitesWithThisInsurance.length}/{firstInsuranceList.length} sites) */}
                                </Text>
                                <PDFTable
                                    data={firstInsuranceList as any[]}
                                    columns={[
                                        { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                                        { key: "standard_code", header: "REFID", width: "16%" },
                                        { key: "site_name", header: "NADI", width: "25%" },
                                        { key: "state", header: "STATE", width: "14%" },
                                        { 
                                            key: "status", 
                                            header: "STATUS", 
                                            align: "center",
                                            render: (value, item) => item.status ? "Yes" : "No"
                                        },
                                        { 
                                            key: "start_date", 
                                            header: "START DATE", 
                                            align: "center",
                                            render: (value, item) => item.start_date ? new Date(item.start_date).toLocaleDateString('en-GB') : "-"
                                        },
                                        { 
                                            key: "end_date", 
                                            header: "END DATE", 
                                            align: "center",
                                            render: (value, item) => item.end_date ? new Date(item.end_date).toLocaleDateString('en-GB') : "-"
                                        },
                                    ]}
                                />
                            </View>
                        );
                    })()
                ) : (
                    <Text>No insurance data available.</Text>
                )}
                <PDFFooter />
            </Page>

            {/* Additional pages for remaining insurance types */}
            {Object.entries(insuranceByType).slice(1).map(([insuranceType, allSitesForType]) => {
                const sitesWithThisInsurance = allSitesForType.filter(site => site.status);
                return (
                    <Page key={insuranceType} size="A4" style={styles.page}>
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ 
                                fontSize: 10, 
                                fontWeight: "bold", 
                                marginBottom: 5,
                                textTransform: "uppercase" 
                            }}>
                                {insuranceType} INSURANCE 
                                {/* ({sitesWithThisInsurance.length}/{allSitesForType.length} sites) */}
                            </Text>
                            <PDFTable
                                data={allSitesForType as any[]}
                                columns={[
                                    { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                                    { key: "standard_code", header: "REFID", width: "16%" },
                                    { key: "site_name", header: "NADI", width: "25%" },
                                    { key: "state", header: "STATE", width: "14%" },
                                    { 
                                        key: "status", 
                                        header: "STATUS", 
                                        align: "center",
                                        render: (value, item) => item.status ? "Yes" : "No"
                                    },
                                    { 
                                        key: "start_date", 
                                        header: "START DATE",  
                                        align: "center",
                                        render: (value, item) => item.start_date ? new Date(item.start_date).toLocaleDateString('en-GB') : "-"
                                    },
                                    { 
                                        key: "end_date", 
                                        header: "END DATE", 
                                        align: "center",
                                        render: (value, item) => item.end_date ? new Date(item.end_date).toLocaleDateString('en-GB') : "-"
                                    },
                                ]}
                            />
                        </View>
                        
                        <PDFFooter />
                    </Page>
                );
            })}

            {/* Page 2: APPENDIX for INSURANCE - Title page */}
            {/* <Page size="A4" style={styles.page}>
                <PDFAppendixTitlePage
                    appendixNumber="APPENDIX"
                    title="SITE INSURANCE"
                />
                <PDFFooter />
            </Page> */}
        </Document>
    );
    // Create a blob from the PDF document (main report and appendix title page)
    const reportBlob = await pdf(insuranceDoc).toBlob();

    // Process all insurance that have attachments as sources for generateFinalPdf
    // const sources: AttachmentSource[] = insurance
    //     .filter(insurance => insurance.attachments_path && insurance.attachments_path.length > 0)
    //     .map(insurance => ({
    //         attachments_path: insurance.attachments_path || [],
    //         standard_code: insurance.standard_code,
    //     }));

    // Generate the final PDF by merging the report with attachment pages
    // const finalPdfBlob = await generateFinalPdf(reportBlob, sources);

    // Generate filename based on filters
    const fileName = generatePdfFilename('insurance-report', claimType, phase?.name);

    // Convert blob to File object with metadata
    return new File([reportBlob], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default Insurance;