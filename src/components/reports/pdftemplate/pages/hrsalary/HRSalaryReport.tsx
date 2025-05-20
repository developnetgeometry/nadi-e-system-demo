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
  PDFSectionTitle,
  PDFTable,
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
  },
  statsBox: {
    border: '1px solid #000',
    padding: 10,
    marginBottom: 10,
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  statsLabel: {
    fontSize: 9,
    color: '#555',
    flex: 1,
  },
  statsValue: {
    fontSize: 10,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  staffTable: {
    marginTop: 15,
  },
  pieChartPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  graphNote: {
    fontSize: 8,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  columnLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  column: {
    width: '48%',
  }
});

export const HRSalaryReportPDF: React.FC<HRSalaryReportPDFProps> = ({
  duspLabel = "",
  phaseLabel = "All Phases",
  periodType = "All Time",
  periodValue = "All Records",
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
  currentYear = new Date().getFullYear()
}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return `RM ${amount.toLocaleString('en-MY')}`;
  };

  return (
    <Document title="HR Salary Report">
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <PDFHeader
          title="NADI HR Salary Report"
          subtitle={`Period: ${periodValue}`}
          mcmcLogo={mcmcLogo}
          duspLogo={duspLogo}
        />

        <PDFMetaSection
          items={[
            { label: "DUSP", value: duspLabel || "All DUSPs" },
            { label: "Phase", value: phaseLabel },
            { label: "Period", value: `${periodType}: ${periodValue}` },
            { label: "Generated On", value: new Date().toLocaleDateString() },
          ]}
        />

        <View style={styles.section}>
          <PDFSectionTitle title="HR Overview" />

          <View style={styles.statsBox}>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Total Staff</Text>
              <Text style={styles.statsValue}>{totalStaff}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Active NADI Sites</Text>
              <Text style={styles.statsValue}>{activeNadiSites}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Sites with Incentives</Text>
              <Text style={styles.statsValue}>{sitesWithIncentives}</Text>
            </View>
          </View>

          <View style={styles.statsBox}>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Average Salary</Text>
              <Text style={styles.statsValue}>{formatCurrency(averageSalary)}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Average Incentive</Text>
              <Text style={styles.statsValue}>{formatCurrency(averageIncentive)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <PDFSectionTitle title="Staff Distribution" />
          <View style={styles.pieChartPlaceholder}>
            <Text>Staff Distribution Graph</Text>
            {employeeDistribution.map((item, index) => (
              <Text key={index}>{item.position}: {item.count} staff</Text>
            ))}
          </View>
          <Text style={styles.graphNote}>
            Note: The actual distribution chart is available in the dashboard view.
          </Text>
        </View>

        <View style={styles.columnLayout}>
          <View style={styles.column}>
            <PDFSectionTitle title="Vacancies" />
            <View style={styles.pieChartPlaceholder}>
              <Text>Vacancies Graph</Text>
              {vacancies.map((item, index) => (
                <Text key={index}>{item.position}: {item.open} open, {item.filled} filled</Text>
              ))}
            </View>
          </View>
          
          <View style={styles.column}>
            <PDFSectionTitle title="Turnover Rate" />
            <View style={styles.pieChartPlaceholder}>
              <Text>Turnover Rate Graph</Text>
              <Text>Average Rate: {averageTurnoverRate.toFixed(1)}%</Text>
            </View>
          </View>
        </View>

        <PDFFooter pageNumber={1} />
      </Page>

      {/* Staff List Page */}
      <Page size="A4" style={styles.page}>
        <PDFHeader
          title="Staff List"
          subtitle={`Period: ${periodValue}`}
          mcmcLogo={mcmcLogo}
          duspLogo={duspLogo}
        />

        <PDFSectionTitle title="Detailed Staff List" />
        <View style={styles.staffTable}>
          <PDFTable
            headers={["Name", "Position", "Site", "Salary", "Has Incentive"]}
            widths={["25%", "20%", "25%", "15%", "15%"]}
            data={staff.map(s => [
              s.fullname,
              s.position || "-",
              s.sitename || "-",
              formatCurrency(s.salary || 0),
              s.has_incentive ? "Yes" : "No"
            ])}
          />
        </View>

        <PDFFooter pageNumber={2} />
      </Page>
    </Document>
  );
};