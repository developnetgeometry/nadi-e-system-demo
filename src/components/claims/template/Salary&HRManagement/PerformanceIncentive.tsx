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
import fetchPerformanceIncentiveData from "./hook/use-performanceIncentive-data";
// Import PDF utilities
import { generatePdfFilename } from "../component/pdf-utils";
import { generateIncentiveBarChartImage } from "./chart/generateIncentiveBarChartImage";
import { generateIncentivePieChartImage } from "./chart/generateIncentivePieChartImage";


const styles = StyleSheet.create({
    page: {
        padding: 40,
        paddingBottom: 80,
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
        width: 110
    },
    totalBoxDashboard: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "solid",
        textAlign: "center",
        fontSize: 10,
        padding: 15,
        width: 130
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

type PerformanceIncentiveProps = {
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
const PerformanceIncentive = async ({
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

}: PerformanceIncentiveProps): Promise<File> => {
    // Fetch Performance Incentive data based on filters
    const { incentive } = await fetchPerformanceIncentiveData({
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });

    console.log("Incentive data:", incentive);

    const formatCurrency = (amount: number) => {
        return `${amount.toFixed(2)}`;
    };


    // Generate chart image (base64 PNG) for PDF
    let incentivePieChartImage: string | null = null;
    let incentiveBarChartImage: string | null = null;
    if (typeof window !== 'undefined' && incentive.length > 0) {
        try {
            incentivePieChartImage = await generateIncentivePieChartImage(incentive);
            incentiveBarChartImage = await generateIncentiveBarChartImage(incentive);
        } catch (e) {
            console.error('Failed to generate salary pie chart image', e);
        }
    }

    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    console.log("Phase data:", phase);
    const phaseLabel = phase?.name || "All Phases";    // Define the PDF document (only the main report pages)
    const PerformanceIncentiveDoc = (
        <Document>
            {/* Page 1: Performance Incentive */}
            <Page size="A4" style={styles.page}>

                {header && (
                    <>
                        <PDFHeader
                            mcmcLogo={"/MCMC_Logo.png"} // Replace with actual MCMC logo if needed
                            duspLogo={dusplogo} // Use provided DUSP logo or placeholder
                        />
                        <PDFMetaSection
                            reportTitle="1.0 Salary & HR Management"
                            phaseLabel={phaseLabel}
                            claimType={claimType}
                            quater={quater}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </>
                )}

                <PDFSectionTitle title="1.2 PERFORMANCE INCENTIVE (MANAGER / ASSISTANT MANAGER / PART TIMER)" />


                <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 5 }}>

                        {/* Performance Incentive Distribution chart here */}
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", flex: 1 }}>
                            {incentivePieChartImage && (
                                <Image src={incentivePieChartImage} style={{ width: "100%", maxHeight: 220, objectFit: "contain" }} />
                            )}
                        </View>

                        <View style={{ flexDirection: "column", justifyContent: "space-evenly", gap: 5 }}>
                            <View style={{ ...styles.totalBoxDashboard }}>
                                {/* Number of Employee*/}
                                <Text>Number of{"\n"}Employee</Text>
                                <Text style={{ fontSize: 13, fontWeight: "bold", textAlign: "center" }}>{incentive.length}</Text>
                            </View>
                            <View style={{ ...styles.totalBoxDashboard }}>
                                {/* total incentive */}
                                <Text>Total Incentive</Text>
                                <Text style={{ fontSize: 13, fontWeight: "bold", textAlign: "center" }}>{formatCurrency((incentive.reduce((total, staff) => total + (staff.staff_incentive || 0), 0)) || 0)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 15 }}>
                        {/* chart bar salary here */}
                        {incentiveBarChartImage && (
                            <Image src={incentiveBarChartImage} style={{ width: "100%", maxHeight: 220, objectFit: "contain" }} />
                        )}
                    </View>
                </View>
                <PDFFooter /> {/* Keep as fixed, but paddingBottom prevents overlap */}
            </Page>

            {/* Performance Incentive list page     */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="1.2 PERFORMANCE INCENTIVE (MANAGER / ASSISTANT MANAGER / PART TIMER)" />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ alignSelf: "flex-start", flexDirection: "row", justifyContent: "space-between", gap: 5 }}>
                        <View style={{ ...styles.totalBox }}>
                            {/* total NADI sites with maintenance */}
                            <Text>Number of Employee</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{incentive.length}</Text>
                        </View>
                    </View>
                    {/* {!header && ( */}
                    <View style={{ alignSelf: "flex-end" }}>
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
                {incentive.length > 0 ? (
                    <PDFTable
                        data={incentive}
                        columns={[
                            { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                            { key: "standard_code", header: "REFID" },
                            { key: "site_name", header: "NADI" },
                            { key: "state", header: "STATE" },
                            { key: "staff_name", header: "FULL NAME" },
                            { key: "staff_position", header: "POSITION" },
                            { key: "staff_start_work_date", header: "DATE START\nWORK" },
                            { key: "staff_end_work_date", header: "DATE END\nWORK" },
                            { key: "staff_duration", header: "DURATION" },
                        ]}
                    />
                ) : (
                    <Text>No incentive data available.</Text>
                )}

                <PDFFooter /> {/* Keep as fixed, but paddingBottom prevents overlap */}
            </Page>

        </Document >
    );
    // Create a blob from the PDF document (main report and appendix title page)
    const reportBlob = await pdf(PerformanceIncentiveDoc).toBlob();

    // Generate filename based on filters
    const fileName = generatePdfFilename('performance-incentive-report', claimType, phase?.name);

    // Convert blob to File object with metadata
    return new File([reportBlob], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default PerformanceIncentive;