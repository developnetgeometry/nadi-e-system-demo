import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    pdf,
    Image,
    Checkbox,
    Svg,
    Rect,
    Path
} from "@react-pdf/renderer";
import {
    PDFFooter,
    PDFTable,
    PDFSectionTitle,
    PDFAppendixTitlePage,
    PDFPhaseQuarterInfo,
    PDFMetaSection,
    PDFHeader,
    PDFCheckbox // <-- import from pdf-component
} from "../component/pdf-component";
// Import the actual data fetching functions, not hooks
import fetchUtilityData from "./hook/use-utility-data";
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
    checkbox: {
        width: 12,
        height: 12,
        borderWidth: 1,
        borderColor: '#222',
        margin: 'auto',
    },
});

type UtilitiesProps = {
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
const Utilities = async ({
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

}: UtilitiesProps): Promise<File> => {
    // Fetch Utilities data based on filters
    const { utility } = await fetchUtilityData({
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });
    console.log("utility data:", utility);

    // Group utility data by month/year and get all unique sites
    const utilityByMonth: Record<string, any[]> = {};
    const allSitesMap = new Map();
    
    // First, collect all unique sites
    utility.forEach(item => {
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
    
    // Group by month/year
    utility.forEach(item => {
        const monthKey = `${item.bill_year}-${String(item.bill_month).padStart(2, '0')}`;
        if (!utilityByMonth[monthKey]) {
            utilityByMonth[monthKey] = [];
        }
        utilityByMonth[monthKey].push(item);
    });
    
    // For each month, ensure all sites are included
    const monthsWithAllSites: Record<string, any[]> = {};
    Object.keys(utilityByMonth).forEach(monthKey => {
        const [year, month] = monthKey.split('-');
        const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
        
        monthsWithAllSites[monthKey] = Array.from(allSitesMap.values()).map(site => {
            // Find utility data for this site in this month
            const siteUtility = utilityByMonth[monthKey].find(item => item.site_id === site.site_id);
            
            return {
                ...site,
                water: siteUtility?.water || null,
                electricity: siteUtility?.electricity || null,
                sewerage: siteUtility?.sewerage || null,
                bill_month: parseInt(month),
                bill_year: parseInt(year),
                monthName
            };
        });
    });

    console.log("Utility by month (all sites):", monthsWithAllSites);
    console.log("All months:", Object.keys(monthsWithAllSites));

    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    console.log("Phase data:", phase);
    const phaseLabel = phase?.name || "All Phases";
    
    // Define the PDF document with multiple pages for each month
    const utilityDoc = (
        <Document>
            {/* Page 1: First month utilities */}
            {Object.entries(monthsWithAllSites).length > 0 ? (
                (() => {
                    const [firstMonthKey, firstMonthData] = Object.entries(monthsWithAllSites)[0];
                    const monthName = firstMonthData[0]?.monthName || '';
                    return (
                        <Page size="A4" style={styles.page}>
                            {header && (
                                <>
                                    <PDFHeader
                                        mcmcLogo={"/MCMC_Logo.png"}
                                        duspLogo={dusplogo}
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

                            <PDFSectionTitle title="2.5 UTILITIES (WATER, ELECTRICITY, SEWERAGE)" />

                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <View style={{ alignSelf: "flex-start", flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                                    <View style={{ ...styles.totalBox }}>
                                        <Text>Total Sites</Text>
                                        <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{allSitesMap.size}</Text>
                                    </View>
                                </View>
                                {!header && (
                                    <View style={{ alignSelf: "flex-end" }}>
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

                            <View style={{ marginTop: 15 }}>
                                <Text style={{ 
                                    fontSize: 10, 
                                    fontWeight: "bold", 
                                    marginBottom: 5,
                                    textTransform: "uppercase" 
                                }}>
                                    {monthName} - UTILITIES
                                </Text>
                                <PDFTable
                                    data={firstMonthData as any[]}
                                    columns={[
                                        { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                                        { key: "standard_code", header: "REFID", width: "15%" },
                                        { key: "site_name", header: "NADI", width: "25%" },
                                        { key: "state", header: "STATE", width: "15%" },
                                        { 
                                            key: "water", 
                                            header: "WATER (RM)", 
                                            width: "13.33%", 
                                            align: "center",
                                            render: (value) => value ? value.toFixed(2) : "-"
                                        },
                                        { 
                                            key: "electricity", 
                                            header: "ELECTRICITY (RM)", 
                                            width: "13.33%", 
                                            align: "center",
                                            render: (value) => value ? value.toFixed(2) : "-"
                                        },
                                        { 
                                            key: "sewerage", 
                                            header: "SEWERAGE (RM)", 
                                            width: "13.33%", 
                                            align: "center",
                                            render: (value) => value ? value.toFixed(2) : "-"
                                        },
                                    ]}
                                />
                            </View>
                            <PDFFooter />
                        </Page>
                    );
                })()
            ) : (
                <Page size="A4" style={styles.page}>
                    {header && (
                        <>
                            <PDFHeader
                                mcmcLogo={"/MCMC_Logo.png"}
                                duspLogo={dusplogo}
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
                    <PDFSectionTitle title="2.5 UTILITIES (WATER, ELECTRICITY, SEWERAGE)" />
                    <Text>No utility data available.</Text>
                    <PDFFooter />
                </Page>
            )}

            {/* Additional pages for remaining months */}
            {Object.entries(monthsWithAllSites).slice(1).map(([monthKey, monthData]) => {
                const monthName = monthData[0]?.monthName || '';
                return (
                    <Page key={monthKey} size="A4" style={styles.page}>
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ 
                                fontSize: 10, 
                                fontWeight: "bold", 
                                marginBottom: 5,
                                textTransform: "uppercase" 
                            }}>
                                {monthName} - UTILITIES
                            </Text>
                            <PDFTable
                                data={monthData as any[]}
                                columns={[
                                    { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                                    { key: "standard_code", header: "REFID", width: "15%" },
                                    { key: "site_name", header: "NADI", width: "25%" },
                                    { key: "state", header: "STATE", width: "15%" },
                                    { 
                                        key: "water", 
                                        header: "WATER (RM)", 
                                        width: "13.33%", 
                                        align: "center",
                                        render: (value) => value ? value.toFixed(2) : "-"
                                    },
                                    { 
                                        key: "electricity", 
                                        header: "ELECTRICITY (RM)", 
                                        width: "13.33%", 
                                        align: "center",
                                        render: (value) => value ? value.toFixed(2) : "-"
                                    },
                                    { 
                                        key: "sewerage", 
                                        header: "SEWERAGE (RM)", 
                                        width: "13.33%", 
                                        align: "center",
                                        render: (value) => value ? value.toFixed(2) : "-"
                                    },
                                ]}
                            />
                        </View>
                        <PDFFooter />
                    </Page>
                );
            })}
        </Document>
    );
    // Create a blob from the PDF document (main report and appendix title page)
    const reportBlob = await pdf(utilityDoc).toBlob();


    // Generate filename based on filters
    const fileName = generatePdfFilename('utility-report', claimType, phase?.name);

    // Convert blob to File object with metadata
    return new File([reportBlob], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default Utilities;