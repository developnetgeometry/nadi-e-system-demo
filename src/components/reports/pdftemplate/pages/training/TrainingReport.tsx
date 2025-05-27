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
import { RefreshTrainingData, UpscalingTrainingData } from "@/hooks/report/use-training-pdf-data";


// Define props for the PDF Report
interface TrainingReportPDFProps {
    // Report info
    duspLabel?: string;
    phaseLabel?: string;
    periodType?: string;
    periodValue?: string;

    upscalingTrainingData?: UpscalingTrainingData[];
    refreshTrainingData?: RefreshTrainingData[];

    // Logos
    mcmcLogo?: string;
    duspLogo?: string;

    // Filter values
    monthFilter?: string | number | null;
    yearFilter?: string | number | null;

}

// PDF styles forTraining report
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: "Helvetica",
        position: "relative",
    },
    totalBox: {
        padding: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "solid",
        textAlign: "center",
        fontSize: 12,
        width: 170
    },
});

export const TrainingReportPDF = ({
    duspLabel = "",
    phaseLabel = "All Phase", // Default to match the image
    periodType = "All Time",
    periodValue = "All Records", // Default to match the image

    upscalingTrainingData = [],
    refreshTrainingData = [],

    mcmcLogo = "",
    duspLogo = "",
    monthFilter = null,
    yearFilter = null,

}: TrainingReportPDFProps) => {


    return (
        <Document>
            {/* Page 1 - UPSCALING TRAINING */}
            <Page size="A4" style={styles.page}>

                <PDFHeader mcmcLogo={mcmcLogo} duspLogo={duspLogo} />

                <PDFMetaSection
                    reportTitle="Training"
                    phaseLabel={phaseLabel}
                    periodType={periodType}
                    periodValue={periodValue}
                />

                <PDFSectionTitle title="5.1 UPSCALING TRAINING" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, position: "relative" }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ ...styles.totalBox, padding: 10, width: 80, marginVertical: 0 }}>
                            <Text style={{ fontSize: 8 }}>Total NADI</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{0 || 'XX'}</Text>
                        </View>
                        <View style={{ ...styles.totalBox, padding: 10, width: 100, marginVertical: 0, marginLeft: 10 }}>
                            <Text style={{ fontSize: 8 }}>Number of Employee</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{0 || 'XX'}</Text>
                        </View>
                        <View style={{ ...styles.totalBox, padding: 10, width: 80, marginVertical: 0, marginLeft: 10 }}>
                            <Text style={{ fontSize: 8 }}>Total Manager</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{0 || 'XX'}</Text>
                        </View>
                        <View style={{ ...styles.totalBox, padding: 10, width: 100, marginVertical: 0, marginLeft: 10 }}>
                            <Text style={{ fontSize: 8 }}>Total Assist Manager</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{0 || 'XX'}</Text>
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
                {/* TABLE */}
                <PDFTable
                    data={upscalingTrainingData.slice(0, 20)}
                    columns={[
                        { header: "NO", key: (_, i) => `${i + 1}.`, width: "5%" },
                        { header: "NADI & STATE", key: row => `${row.sitename}, ${row.state}` },
                        { header: "FULL NAME", key: "fullname" },
                        { header: "POSITION", key: "position" },
                        { header: "PROGRAM NAME", key: "programme_name" },
                        { header: "METHOD", key: "programme_method" },
                        { header: "VENUE", key: "programme_venue"},
                        { header: "DATE TRAINING", key: "programme_date" },
                    ]}
                />

                <PDFFooter />
            </Page>

            {/* Page 2 - Salary Section */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="5.2 REFRESH TRAINING (MANAGER / ASSISTANT MANAGER)" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, position: "relative" }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ ...styles.totalBox, padding: 10, width: 80, marginVertical: 0 }}>
                            <Text style={{ fontSize: 8 }}>Total NADI</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{0 || 'XX'}</Text>
                        </View>
                        <View style={{ ...styles.totalBox, padding: 10, width: 80, marginVertical: 0, marginLeft: 10 }}>
                            <Text style={{ fontSize: 8 }}>Number of Employee</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{0 || 'XX'}</Text>
                        </View>
                        <View style={{ ...styles.totalBox, padding: 10, width: 80, marginVertical: 0, marginLeft: 10 }}>
                            <Text style={{ fontSize: 8 }}>Total Manager</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{0 || 'XX'}</Text>
                        </View>
                        <View style={{ ...styles.totalBox, padding: 10, width: 80, marginVertical: 0, marginLeft: 10 }}>
                            <Text style={{ fontSize: 8 }}>Total Assist Manager</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{0 || 'XX'}</Text>
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
                {/* TABLE */}
                <PDFTable
                    data={refreshTrainingData.slice(0, 20)}
                    columns={[
                        { header: "NO", key: (_, i) => `${i + 1}.`, width: "5%" },
                        { header: "NADI & STATE", key: row => `${row.sitename}, ${row.state}` },
                        { header: "FULL NAME", key: "fullname" },
                        { header: "POSITION", key: "position" },
                        { header: "PROGRAM NAME", key: "programme_name" },
                        { header: "METHOD", key: "programme_method" },
                        { header: "VENUE", key: "programme_venue"},
                        { header: "DATE TRAINING", key: "programme_date" },
                    ]}
                />

                <PDFFooter />
            </Page>
        </Document>
    );
};
