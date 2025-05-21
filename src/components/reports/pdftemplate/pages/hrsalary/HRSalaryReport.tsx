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
import { StaffDistribution, StaffVacancy, TurnoverRate, HRStaffMember } from "@/hooks/report/use-hr-salary-data";


// Define props for the PDF Report
interface HRSalaryReportPDFProps {
    // Report info
    duspLabel?: string;
    phaseLabel?: string;
    periodType?: string;
    periodValue?: string;

    // Data for reports
    staff: HRStaffMember[];
    totalStaff: number;
    activeNadiSites: number;
    sitesWithIncentives: number;
    averageSalary: number;
    averageIncentive: number;
    employeeDistribution: StaffDistribution[];
    vacancies: StaffVacancy[];
    turnoverRates: TurnoverRate[];
    averageTurnoverRate: number;

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
        color: "#0000FF",
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
    periodType = "QUARTER / YEAR",
    periodValue = "4/2024", // Default to match the image
    staff = [],
    totalStaff = 0,
    activeNadiSites = 0,
    sitesWithIncentives = 0,
    averageSalary = 0,
    averageIncentive = 0,
    employeeDistribution = [],
    vacancies = [],
    turnoverRates = [],
    averageTurnoverRate = 0,
    mcmcLogo = "",
    duspLogo = "",
    monthFilter = null,
    yearFilter = null,
    currentMonth = new Date().getMonth() + 1,
    currentYear = new Date().getFullYear(),
    staffDistributionChart = "",
    salaryChart = "",
    vacancyChart = ""
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
                    <View style={styles.pieChartPlaceholder}>                        {staffDistributionChart ? (
                            <Image src={staffDistributionChart} style={{ width: 360, height: 220, objectFit: "contain" }} />
                        ) : (
                            <>
                                <Text>Number of Staff by Designation (Total: 5)</Text>
                                <Text>Manager (2)</Text>
                                <Text>Assistant Manager (1)</Text>
                                <Text>Part-timer (2)</Text>
                            </>
                        )}
                    </View>

                    <View style={styles.summaryBoxContainer}>
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>Number of Employees</Text>
                            <Text style={styles.summaryValue}>Total : {totalStaff || "XX"}</Text>
                        </View>
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>Salary</Text>
                            <Text style={styles.summaryValue}>Total : RM {formatCurrency((averageSalary * totalStaff) || 0)}</Text>
                        </View>
                    </View>
                </View>                {/* Salary Bar Chart */}
                <View style={styles.barChartPlaceholder}>
                    {salaryChart ? (
                        <Image src={salaryChart} style={{ width: 520, height: 240, objectFit: "contain" }} />
                    ) : (
                        <>
                            <Text>Salary Amount (RM) by Designation</Text>
                            <Text>Manager: RM 5000</Text>
                            <Text>Assistant Manager: RM 3000</Text>
                            <Text>Part-timer: RM 2000</Text>
                        </>
                    )}
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
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{totalStaff || "XX"}</Text>
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
                <View style={styles.dataTable}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, { width: '5%' }]}>NO</Text>
                        <Text style={[styles.tableHeaderCell, { width: '25%' }]}>NADI & STATE</Text>
                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>FULL NAME</Text>
                        <Text style={[styles.tableHeaderCell, { width: '15%' }]}>POSITION</Text>
                        <Text style={[styles.tableHeaderCell, { width: '15%' }]}>JOIN DATE</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%' }]}>SERVICES PERIOD</Text>
                        <Text style={[styles.tableHeaderCell, { width: '10%', borderRightWidth: 0 }]}>SALARY (RM)</Text>
                    </View>

                    {staff.slice(0, 20).map((member, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: '5%' }]}>{index + 1}.</Text>
                            <Text style={[styles.tableCell, { width: '25%' }]}>{member.sitename}, {member.state}</Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}>{member.fullname}</Text>
                            <Text style={[styles.tableCell, { width: '15%' }]}>{member.position}</Text>
                            <Text style={[styles.tableCell, { width: '15%' }]}>{member.join_date}</Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>{member.service_period}</Text>
                            <Text style={[styles.tableCell, { width: '10%', borderRightWidth: 0 }]}>{formatCurrency(member.salary || 0)}</Text>
                        </View>
                    ))}
                </View>

                <PDFFooter customText="This document is system-generated from e-System." />
            </Page>

            {/* Page 3 - Performance Incentive */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="1.2 PERFORMANCE INCENTIVE (MANAGER / ASSISTANT MANAGER / PART TIMER)" />
                {/* Staff Distribution Section */}
                <View style={styles.chartContainer}>
                    <View style={styles.pieChartPlaceholder}>
                        {staffDistributionChart ? (
                            <Image src={staffDistributionChart} style={{ width: 320, height: 250, objectFit: "contain" }} />
                        ) : (
                            <>
                                <Text>Number of Staff by Designation (Total: 5)</Text>
                                <Text>Manager (2)</Text>
                                <Text>Assistant Manager (1)</Text>
                                <Text>Part-timer (2)</Text>
                            </>
                        )}
                    </View>

                    <View style={styles.summaryBoxContainer}>
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>Number of Employees</Text>
                            <Text style={styles.summaryValue}>Total : {totalStaff || "XX"}</Text>
                        </View>
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>Performance Incentive</Text>
                            <Text style={styles.summaryValue}>Total : RM {formatCurrency((averageIncentive * totalStaff) || 0)}</Text>
                        </View>
                    </View>
                </View>

                {/* Performance Incentive Bar Chart */}
                <View style={styles.barChartPlaceholder}>
                    <Text>Performance Incentives (RM) by Designation</Text>
                    <Text>Manager: RM 2000</Text>
                    <Text>Assistant Manager: RM 1500</Text>
                    <Text>Part-timer: RM 1000</Text>
                    {/* This would be a bar chart in real implementation */}
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
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{totalStaff || "XX"}</Text>
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
                <View style={styles.dataTable}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, { width: '5%' }]}>NO</Text>
                        <Text style={[styles.tableHeaderCell, { width: '25%' }]}>NADI & STATE</Text>
                        <Text style={[styles.tableHeaderCell, { width: '20%' }]}>FULL NAME</Text>
                        <Text style={[styles.tableHeaderCell, { width: '15%' }]}>POSITION</Text>
                        <Text style={[styles.tableHeaderCell, { width: '15%' }]}>DATE START WORK</Text>
                        <Text style={[styles.tableHeaderCell, { width: '15%' }]}>DATE END WORK</Text>
                        <Text style={[styles.tableHeaderCell, { width: '5%', borderRightWidth: 0 }]}>DURATION</Text>
                    </View>

                    {staff.slice(0, 20).map((member, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: '5%' }]}>{index + 1}.</Text>
                            <Text style={[styles.tableCell, { width: '25%' }]}>{member.sitename}, {member.state}</Text>
                            <Text style={[styles.tableCell, { width: '20%' }]}>{member.fullname}</Text>
                            <Text style={[styles.tableCell, { width: '15%' }]}>{member.position}</Text>
                            <Text style={[styles.tableCell, { width: '15%' }]}>{member.date_start_work}</Text>
                            <Text style={[styles.tableCell, { width: '15%' }]}>{member.date_end_work}</Text>
                            <Text style={[styles.tableCell, { width: '5%', borderRightWidth: 0 }]}>{member.duration}</Text>
                        </View>
                    ))}
                </View>

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
                        ) : (
                            <>
                                <Text>Number of Vacancies by Designation (Total: 5)</Text>
                                <Text>Manager (3)</Text>
                                <Text>Assistant Manager (2)</Text>
                            </>
                        )}
                    </View>

                    <View style={styles.summaryBoxContainer}>
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>Number of Vacancies</Text>
                            <Text style={styles.summaryValue}>
                                {vacancies.reduce((sum, vacancy) => sum + vacancy.open, 0) || 5}
                            </Text>
                        </View>

                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>Turnover Rate</Text>
                            <Text style={styles.summaryValue}>
                                {averageTurnoverRate ? `${averageTurnoverRate}%` : '0.3%'}
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
                        <View style={{ ...styles.totalBox, padding: 10, width: 80, marginVertical: 0 }}>
                            <Text style={{ fontSize: 8 }}>Number of Vacancies</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{vacancies.reduce((sum, vacancy) => sum + vacancy.open, 0) || "X"}</Text>
                        </View>
                        <View style={{ ...styles.totalBox, padding: 10, width: 80, marginVertical: 0, marginLeft: 10 }}>
                            <Text style={{ fontSize: 8 }}>Manager</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{vacancies.find(v => v.position === 'Manager')?.open || "X"}</Text>
                        </View>
                        <View style={{ ...styles.totalBox, padding: 10, width: 80, marginVertical: 0, marginLeft: 10 }}>
                            <Text style={{ fontSize: 8 }}>Assistant Manager</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{vacancies.find(v => v.position === 'Assistant Manager')?.open || "X"}</Text>
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
                <View style={styles.dataTable}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, { width: '5%' }]}>NO</Text>
                        <Text style={[styles.tableHeaderCell, { width: '40%' }]}>NADI</Text>
                        <Text style={[styles.tableHeaderCell, { width: '30%' }]}>STATE</Text>
                        <Text style={[styles.tableHeaderCell, { width: '25%', borderRightWidth: 0 }]}>POSITION</Text>
                    </View>

                    {/* Show only 8 rows as in the image */}
                    {[...Array(8)].map((_, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: '5%' }]}>{index + 1}.</Text>
                            <Text style={[styles.tableCell, { width: '40%' }]}>{index % 2 === 0 ? 'BATU 1 SUNGAI PINGGAN' : 'KAMPUNG BERUAS'}</Text>
                            <Text style={[styles.tableCell, { width: '30%' }]}>{index % 2 === 0 ? 'JOHOR' : 'PAHANG'}</Text>
                            <Text style={[styles.tableCell, { width: '25%', borderRightWidth: 0 }]}>{index % 2 === 0 ? 'MANAGER' : 'ASSISTANT MANAGER'}</Text>
                        </View>
                    ))}
                </View>

                <PDFFooter customText="This document is system-generated from e-System." />
            </Page>
        </Document>
    );
};
