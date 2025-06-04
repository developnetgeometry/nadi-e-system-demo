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
import fetchManPowerData from "./hook/use-manpower-data";
// Import PDF utilities
import { generatePdfFilename } from "../component/pdf-utils";
import { generateManPowerPieChartImage } from "./chart/generateManPowerPieChartImage";


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
        width: 100
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

type ManPowerProps = {
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
const ManPower = async ({
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

}: ManPowerProps): Promise<File> => {
    // Fetch Man Power data based on filters
    const { manpower } = await fetchManPowerData({
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });

    console.log("Man Power data:", manpower);

    const formatCurrency = (amount: number) => {
        return `${amount.toFixed(2)}`;
    };


    // Generate chart image (base64 PNG) for PDF
    let manPowerPieChartImage: string | null = null;
    if (typeof window !== 'undefined' && manpower.length > 0) {
        try {
            manPowerPieChartImage = await generateManPowerPieChartImage(manpower);
        } catch (e) {
            console.error('Failed to generate vacancy pie chart image', e);
        }
    }
    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    console.log("Phase data:", phase);
    const phaseLabel = phase?.name || "All Phases";    // Define the PDF document (only the main report pages)
    const ManPowerDoc = (
        <Document>
            {/* Page 1: Man Power */}
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

                <PDFSectionTitle title="1.3 MANPOWER MANAGEMENT (MANAGER / ASSISTANT MANAGER)" />

                <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ alignSelf: "flex-start", flexDirection: "row", justifyContent: "space-between", gap: 5 }}>
                            <View style={{ ...styles.totalBox }}>
                                {/* Number of Vacancies */}
                                <Text>Number of Vacancies</Text>
                                <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{manpower.length}</Text>
                            </View>
                            <View style={{ ...styles.totalBox }}>
                                {/* Turn Over Rate */}
                                <Text>Turn Over Rate</Text>
                                <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{ }</Text>
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
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center",marginTop: 20 }}>
                        {manPowerPieChartImage && (
                            <Image src={manPowerPieChartImage} style={{ width: "100%", maxHeight: "100%", objectFit: "contain" }} />
                        )}
                    </View>
                </View>
                <PDFFooter /> {/* Keep as fixed, but paddingBottom prevents overlap */}
            </Page>

            {/* Man Power list page     */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="1.3 MANPOWER MANAGEMENT (MANAGER / ASSISTANT MANAGER)" />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ alignSelf: "flex-start", flexDirection: "row", justifyContent: "space-between", gap: 5 }}>
                        <View style={{ ...styles.totalBox }}>
                            {/* total NADI sites with maintenance */}
                            <Text>Number of Vacancies</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{manpower.length}</Text>
                        </View>
                        <View style={{ ...styles.totalBox }}>
                            {/* total NADI sites with maintenance */}
                            <Text>Manager</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{manpower.filter(v => v.position === 'Manager')?.length}</Text>
                        </View>
                        <View style={{ ...styles.totalBox }}>
                            {/* total NADI sites with maintenance */}
                            <Text>Assistant Manager</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{manpower.filter(v => v.position === 'Assistant Manager')?.length}</Text>
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
                {manpower.length > 0 ? (
                    <PDFTable
                        data={manpower}
                        columns={[
                            { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                            { key: "standard_code", header: "REFID" },
                            { key: "site_name", header: "NADI" },
                            { key: "state", header: "STATE" },
                            { key: "position", header: "POSITION" },
                        ]}
                    />
                ) : (
                    <Text>No manpower data available.</Text>
                )}

                <PDFFooter /> {/* Keep as fixed, but paddingBottom prevents overlap */}
            </Page>

        </Document >
    );
    // Create a blob from the PDF document (main report and appendix title page)
    const reportBlob = await pdf(ManPowerDoc).toBlob();

    // Generate filename based on filters
    const fileName = generatePdfFilename('man-power-report', claimType, phase?.name);

    // Convert blob to File object with metadata
    return new File([reportBlob], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default ManPower;