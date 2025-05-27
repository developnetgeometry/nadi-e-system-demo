import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image
} from "@react-pdf/renderer";
import {
    PDFHeader,
    PDFFooter,
    PDFMetaSection,
    PDFTable,
    PDFSectionTitle,
    PDFAppendixTitlePage,
    PDFPhaseQuarterInfo

} from "../../components/PDFComponents";
import { staffPerformanceIncentive, staffSalary, staffVacancy } from "@/hooks/report/use-hr-salary-pdf-data";


// Define props for the PDF Report
interface HRSalaryReportPDFProps {
    // Report info
    duspLabel?: string;
    phaseLabel?: string;
    periodType?: string;
    periodValue?: string;

    // Data for reports
    staffSalary: staffSalary[];
    staffPerformanceIncentive: staffPerformanceIncentive[];
    staffVacancy: staffVacancy[];
   

    // Logos
    mcmcLogo?: string;
    duspLogo?: string;

    // Filter values
    monthFilter?: string | number | null;
    yearFilter?: string | number | null;
    currentMonth?: string | number;
    currentYear?: string | number;

    // Chart images (generated with html2canvas)
    staffDistributionChart?: string;
    salaryChart?: string;
    vacancyChart?: string;
    incentiveChart?: string;
    incentiveDistributionChart?: string;
}

// PDF styles for HR Salary report
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: "Helvetica",
        position: "relative",
    },
    section: {
        marginBottom: 15,
    }, headerWithLogo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
        alignItems: "center",
    },
    logo: {
        width: 100,
        height: 70,
        objectFit: "contain",
    },
    headerTextContainer: {
        textAlign: "center",
        flex: 1,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "uppercase"
    }, reportHeaderTable: {
        width: "100%",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#000",
        marginBottom: 20,
    },
    reportHeaderRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        borderBottomStyle: "solid",
    },
    reportHeaderLabelCell: {
        width: "15%",
        padding: 8,
        backgroundColor: "#000",
        color: "#fff",
    },
    reportHeaderValueCell: {
        width: "35%",
        padding: 8,
    },
    sectionTitle: {
        backgroundColor: "#000",
        color: "#fff",
        padding: 8,
        marginTop: 15,
        marginBottom: 15,
        fontSize: 12,
        fontWeight: "bold",
    },
    dataTable: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "solid",
        marginBottom: 20,
    },
    tableHeader: {
        backgroundColor: "#000",
        color: "#fff",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
    },
    tableHeaderCell: {
        padding: 8,
        fontWeight: "bold",
        color: "#fff",
        borderRightWidth: 1,
        borderRightColor: "#fff",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
    },
    tableCell: {
        padding: 8,
        borderRightWidth: 1,
        borderRightColor: "#000",
    }, summaryBox: {
        border: "1px solid #000",
        padding: 12,
        width: "100%",
        alignItems: "center",
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
    },
    summaryTitle: {
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        color: "black",
    }, chartContainer: {
        flexDirection: "row",
        marginBottom: 20,
        justifyContent: "space-between",
    },    pieChartPlaceholder: {
        width: '65%',
        height: 220,  // Reduced height to help fit everything on first page
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    summaryBoxContainer: {
        width: '30%',
        padding: 5,
        justifyContent: 'space-around',
    },    barChartPlaceholder: {
        width: '100%',
        height: 240,  // Reduced height to fit better on first page
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginTop: 5, // Reduced top margin
    },
    vacanciesSection: {
        flexDirection: "row",
        marginTop: 15,
    },
    vacancyBox: {
        marginRight: 10,
        padding: 8,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#000",
        width: 80,
        alignItems: "center",
    },
    totalBox: {
        padding: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#000",
        marginVertical: 10,
    }
});

export const HRSalaryReportPDF: React.FC<HRSalaryReportPDFProps> = ({
    duspLabel = "",
    phaseLabel = "PILOT", // Default to match the image
    periodType = "All Time", // Default to match the image
    periodValue = "All Time", // Default to match the image

    staffVacancy = [],
    staffPerformanceIncentive = [],
    staffSalary = [],

    mcmcLogo = "",
    duspLogo = "",
    monthFilter = null,
    yearFilter = null,
    currentMonth = new Date().getMonth() + 1,
    currentYear = new Date().getFullYear(),

    staffDistributionChart = "",
    salaryChart = "",
    vacancyChart = "",
    incentiveChart = "",
    incentiveDistributionChart = "",

}) => {
    // Format salary to RM format
    const formatCurrency = (amount: number) => {
        return `${amount.toFixed(2)}`;
    };

    return (
        <Document title="HR Salary Report">
            {/* Page 1 - Salary Section */}
            <Page size="A4" style={styles.page}>

                <PDFHeader mcmcLogo={mcmcLogo} duspLogo={duspLogo} />

                <PDFMetaSection
                    reportTitle="Salary & HR Management"
                    phaseLabel={phaseLabel}
                    periodType={periodType}
                    periodValue={periodValue}
                />

                <PDFSectionTitle title="1.1 SALARY (MANAGER / ASSISTANT MANAGER / PART TIMER)" />

                {/* Staff Distribution Section */}
                <View style={styles.chartContainer}>
                    <View style={styles.pieChartPlaceholder}>                        
                        {staffDistributionChart ? (
                            <Image src={staffDistributionChart} style={{ objectFit: "contain" }} />
                        ) : null}
                    </View>

                    <View style={styles.summaryBoxContainer}>
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>Number of Employees</Text>
                            <Text style={styles.summaryValue}>Total : {staffSalary.length || "XX"}</Text>
                        </View>
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>Salary</Text>
                            <Text style={styles.summaryValue}>Total : RM {formatCurrency((staffSalary.reduce((total, staff) => total + (staff.salary || 0), 0)) || 0)}</Text>
                        </View>
                    </View>
                </View>                
                {/* Salary Bar Chart */}
                <View style={styles.barChartPlaceholder}>
                    {salaryChart ? (
                        <Image src={salaryChart} style={{ objectFit: "contain" }} />
                    ) : null}
                </View>

                <PDFFooter customText="This document is system-generated from e-System." />


            </Page>
            {/* Page 2 - Staff List */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="1.1 SALARY (MANAGER / ASSISTANT MANAGER / PART TIMER)" />

                 <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, position: "relative" }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ ...styles.totalBox, padding: 10, width: 80, marginVertical: 0 }}>
                            <Text style={{ fontSize: 8 }}>Number of Employees</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{staffSalary.length || "XX"}</Text>
                        </View>
                    </View>
                    <View style={{ position: "absolute", bottom: 0, right: 0 }}>
                        <PDFPhaseQuarterInfo
                            phaseLabel={phaseLabel}
                            periodType={periodType}
                            periodValue={periodValue}
                        />
                    </View>
                </View>

                {/* Staff Table */}
                <PDFTable
                    data={staffSalary}
                    columns={[
                        { header: "NO", key: (_, i) => `${i + 1}.`,width: "5%"  },
                        { header: "NADI & STATE", key: row => `${row.sitename}, ${row.state}` },
                        { header: "FULL NAME", key: "staffName" },
                        { header: "POSITION", key: "position" },
                        { header: "JOIN DATE", key: "staffJoiningDate" },
                        { header: "SERVICES PERIOD", key: "service_period" },
                        { header: "SALARY (RM)", key: "salary", render: v => formatCurrency(v || 0) },
                    ]}
                />

                <PDFFooter customText="This document is system-generated from e-System." />
            </Page>

            {/* Page 3 - Performance Incentive */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="1.2 PERFORMANCE INCENTIVE (MANAGER / ASSISTANT MANAGER / PART TIMER)" />
                {/* Staff Distribution Section (for incentives) */}
                <View style={styles.chartContainer}>
                    <View style={styles.pieChartPlaceholder}>
                        {incentiveDistributionChart ? (
                            <Image src={incentiveDistributionChart} style={{ width: 320, height: 250, objectFit: "contain" }} />
                        ) : null}
                    </View>

                    <View style={styles.summaryBoxContainer}>
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>Number of Employees</Text>
                            <Text style={styles.summaryValue}>Total : {staffPerformanceIncentive.length || "XX"}</Text>
                        </View>
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>Performance Incentive</Text>
                            <Text style={styles.summaryValue}>Total : RM {formatCurrency(staffPerformanceIncentive.reduce((total, staff) => total + (staff.incentive || 0), 0))}</Text>
                        </View>
                    </View>
                </View>

                {/* Performance Incentive Bar Chart */}
                <View style={styles.barChartPlaceholder}>
                    {incentiveChart ? (
                        <Image src={incentiveChart} style={{ objectFit: "contain" }} />
                    ) : null}
                </View>

                <PDFFooter customText="This document is system-generated from e-System." />
            </Page>

            {/* Page 4 - Performance Incentive List */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="1.2 PERFORMANCE INCENTIVE (MANAGER / ASSISTANT MANAGER / PART TIMER)" />

                 <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, position: "relative" }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ ...styles.totalBox, padding: 10, width: 80, marginVertical: 0 }}>
                            <Text style={{ fontSize: 8 }}>Number of Employees</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{staffPerformanceIncentive.length || "XX"}</Text>
                        </View>
                    </View>
                    <View style={{ position: "absolute", bottom: 0, right: 0 }}>
                        <PDFPhaseQuarterInfo
                            phaseLabel={phaseLabel}
                            periodType={periodType}
                            periodValue={periodValue}
                        />
                    </View>
                </View>

                {/* Performance Incentive Table */}
                <PDFTable
                    data={staffPerformanceIncentive}
                    columns={[
                        { header: "NO", key: (_, i) => `${i + 1}.`,width: "5%" },
                        { header: "NADI & STATE", key: row => `${row.sitename}, ${row.state}` },
                        { header: "FULL NAME", key: "staffName" },
                        { header: "POSITION", key: "position" },
                        { header: "DATE START WORK", key: "startWorkDate" },
                        { header: "DATE END WORK", key: "endWorkDate" },
                        { header: "DURATION", key: "duration" },
                    ]}
                />

                <PDFFooter customText="This document is system-generated from e-System." />
            </Page>

            {/* Page 5 - Manpower Management */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="1.3 MANPOWER MANAGEMENT (MANAGER / ASSISTANT MANAGER)" />

                {/* Vacancies and Turnover Rate */}
                <View style={styles.chartContainer}>
                    <View style={{ width: '65%' }}>
                        {/* Vacancies Pie Chart */}
                        {vacancyChart ? (
                            <Image src={vacancyChart} style={{ width: 360, height: 270, objectFit: "contain" }} />
                        ) : null}
                    </View>

                    <View style={styles.summaryBoxContainer}>
                          <View style={styles.summaryBox}>
                              <Text style={styles.summaryTitle}>Number of Vacancies</Text>
                              <Text style={styles.summaryValue}>
                                  {staffVacancy.length || "XX"}
                              </Text>
                          </View>
                          <View style={styles.summaryBox}>
                              <Text style={styles.summaryTitle}>Turnover Rate</Text>
                              <Text style={styles.summaryValue}>
                                  {0.4}%
                              </Text>
                          </View>
                    </View>
                </View>

                <PDFFooter customText="This document is system-generated from e-System." />
            </Page>

            {/* Page 6 - Vacancies List */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="1.3 MANPOWER MANAGEMENT (MANAGER / ASSISTANT MANAGER)" />
                {/* Vacancy Summary Boxes */}

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, position: "relative" }}>
                    <View style={{ flexDirection: "row" }}>
                          <View style={{ ...styles.totalBox, padding: 10, width: 100, marginVertical: 0 }}>
                              <Text style={{ fontSize: 8 }}>Number of Vacancies</Text>
                              <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{staffVacancy.length}</Text>
                          </View>
                          <View style={{ ...styles.totalBox, padding: 10, width: 100, marginVertical: 0, marginLeft: 10 }}>
                              <Text style={{ fontSize: 8 }}>Manager</Text>
                              <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{staffVacancy.filter(v => v.position === 'Manager')?.length}</Text>
                          </View>
                          <View style={{ ...styles.totalBox, padding: 10, width: 100, marginVertical: 0, marginLeft: 10 }}>
                              <Text style={{ fontSize: 8 }}>Assistant Manager</Text>
                              <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{staffVacancy.filter(v => v.position === 'Assistant Manager')?.length}</Text>
                          </View>
                    </View>
                    <View style={{ position: "absolute", bottom: 0, right: 0 }}>
                        <PDFPhaseQuarterInfo
                            phaseLabel={phaseLabel}
                            periodType={periodType}
                            periodValue={periodValue}
                        />
                    </View>
                </View>

                {/* Vacancies Table */}
                <PDFTable
                    data={staffVacancy}
                    columns={[
                        { header: "NO", key: (_, i) => `${i + 1}.`,width: "5%"  },
                        { header: "NADI", key: "sitename" },
                        { header: "STATE", key:"state" },
                        { header: "POSITION", key:"position" },
                    ]}
                />

                <PDFFooter customText="This document is system-generated from e-System." />
            </Page>
        </Document>
    );
};
