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
    PDFPhaseQuarterInfo,
    PDFMetaSection,
    PDFHeader
} from "../component/pdf-component";
// Import the actual data fetching functions, not hooks
import { fetchPhaseData } from "@/hooks/use-phase";
import fetchSalaryData from "./hook/use-salary-data";
// Import PDF utilities
import { generatePdfFilename } from "../component/pdf-utils";
import { generateSalaryPieChartImage } from "./chart/generateSalaryPieChartImage";
import { generateSalaryBarChartImage } from "./chart/generateSalaryBarChartImage";


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

type SalaryProps = {
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
const Salary = async ({
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

}: SalaryProps): Promise<File> => {
    // Fetch salary data based on filters
    const { salary } = await fetchSalaryData({
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });

    console.log("salary data:", salary);

    const formatCurrency = (amount: number) => {
        return `${amount.toFixed(2)}`;
    };


    // Generate chart image (base64 PNG) for PDF
    let salaryPieChartImage: string | null = null;
    let salaryBarChartImage: string | null = null;
    if (typeof window !== 'undefined' && salary.length > 0) {
        try {
            salaryPieChartImage = await generateSalaryPieChartImage(salary);
            salaryBarChartImage = await generateSalaryBarChartImage(salary);
        } catch (e) {
            console.error('Failed to generate salary pie chart image', e);
        }
    }

    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    console.log("Phase data:", phase);
    const phaseLabel = phase?.name || "All Phases";    // Define the PDF document (only the main report pages)
    const SalaryDoc = (
        <Document>
            {/* Page 1: Salary */}
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

                <PDFSectionTitle title="1.1 SALARY (MANAGER / ASSISTANT MANAGER / PART TIMER)" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
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

                {/* salary chart here */}
                <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 5 }}>

                        {/* salary Distribution chart here */}
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", flex: 1 }}>
                            {salaryPieChartImage && (
                                <Image src={salaryPieChartImage} style={{ width: "100%", maxHeight: 220, objectFit: "contain" }} />
                            )}
                        </View>

                        <View style={{flexDirection: "column", justifyContent: "space-evenly", gap: 5 }}>
                            <View style={{ ...styles.totalBoxDashboard }}>
                                {/* Number of Employee*/}
                                <Text>Number of Employees</Text>
                                <Text style={{ fontSize: 13, fontWeight: "bold", textAlign: "center" }}>{salary.length}</Text>
                            </View>
                            <View style={{ ...styles.totalBoxDashboard }}>
                                {/* total salary */}
                                <Text>Total Salary</Text>
                                <Text style={{ fontSize: 13, fontWeight: "bold", textAlign: "center" }}>{formatCurrency((salary.reduce((total, staff) => total + (staff.staff_salary || 0), 0)) || 0)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 15 }}>
                        {/* chart bar salary here */}
                        {salaryBarChartImage && (
                            <Image src={salaryBarChartImage} style={{ width: "100%", maxHeight: 220, objectFit: "contain" }} />
                        )}
                    </View>
                </View>
                <PDFFooter /> {/* Keep as fixed, but paddingBottom prevents overlap */}
            </Page>

            {/* salary list page     */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="1.1 SALARY (MANAGER / ASSISTANT MANAGER / PART TIMER)" />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ alignSelf: "flex-start", flexDirection: "row", justifyContent: "space-between", gap: 5 }}>
                        <View style={{ ...styles.totalBox }}>
                            {/* total NADI sites with maintenance */}
                            <Text>Number of Employee</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{salary.length}</Text>
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
                {salary.length > 0 ? (
                    <PDFTable
                        data={salary}
                        columns={[
                            { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                            { key: "standard_code", header: "REFID" },
                            { key: "site_name", header: "NADI" },
                            { key: "state", header: "STATE" },
                            { key: "staff_name", header: "FULL NAME" },
                            { key: "staff_position", header: "POSITION" },
                            { key: "staff_join_date", header: "JOIN DATE" },
                            { key: "staff_service_period", header: "SERVICE PERIOD" },
                            { key: "staff_salary", header: "SALARY (RM)", render: v => formatCurrency(v || 0) },
                        ]}
                    />
                ) : (
                    <Text>No Salary data available.</Text>
                )}

                <PDFFooter /> {/* Keep as fixed, but paddingBottom prevents overlap */}
            </Page>

        </Document >
    );
    // Create a blob from the PDF document (main report and appendix title page)
    const reportBlob = await pdf(SalaryDoc).toBlob();

    // Generate filename based on filters
    const fileName = generatePdfFilename('salary-report', claimType, phase?.name);

    // Convert blob to File object with metadata
    return new File([reportBlob], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default Salary;