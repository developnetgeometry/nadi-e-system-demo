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
import { programmeImplementedData, programmeParticipationData } from "@/hooks/report/use-smartservice-byphase-pdf-data";



// Add the PillarData and Program interfaces for type safety
interface Program {
    name: string;
    no_of_programme: number | null;
    no_of_participation: number | null;
}
interface PillarData {
    pillar: string;
    programs: Program[];
}

// Define props for the PDF Report
interface SmartServiceByPhaseReportPDFProps {
    // Report info
    duspLabel?: string;
    phaseLabel?: string;
    periodType?: string;
    periodValue?: string;

    // Logos
    mcmcLogo?: string;
    duspLogo?: string;

    // Filter values
    monthFilter?: string | number | null;
    yearFilter?: string | number | null;

    pillarData?: PillarData[];
    programmeImplementedData?: programmeImplementedData[];
    programmeParticipationData?:programmeParticipationData[];
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

export const SmartServiceByPhaseReportPDF = ({
    duspLabel = "",
    phaseLabel = "All Phase",
    periodType = "All Time",
    periodValue = "All Records",
    mcmcLogo = "",
    duspLogo = "",
    monthFilter = null,
    yearFilter = null,
    pillarData = [],
    programmeImplementedData = [],
    programmeParticipationData = []
}: SmartServiceByPhaseReportPDFProps) => {
    // Calculate total program and participant
    const totalProgram = pillarData.reduce((sum, pillar) => sum + pillar.programs.reduce((s, p) => s + (p.no_of_programme || 0), 0), 0);
    const totalParticipant = pillarData.reduce((sum, pillar) => sum + pillar.programs.reduce((s, p) => s + (p.no_of_participation || 0), 0), 0);

    return (
        <Document>
            {/* Page 1 - SMART SERVICES */}
            <Page size="A4" style={styles.page}>
                <PDFHeader mcmcLogo={mcmcLogo} duspLogo={duspLogo} />
                <PDFMetaSection
                    reportTitle="7.0 Smart Service"
                    phaseLabel={phaseLabel}
                    periodType={periodType}
                    periodValue={periodValue}
                />
                <PDFSectionTitle title="7.1 SMART SERVICES" />
                <View style={{ flexDirection: "row" }}>
                    <View style={{ ...styles.totalBox, padding: 10, width: 100, marginVertical: 0 }}>
                        <Text style={{ fontSize: 8 }}>Total Program</Text>
                        <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{totalProgram}</Text>
                    </View>
                    <View style={{ ...styles.totalBox, padding: 10, width: 100, marginVertical: 0, marginLeft: 10 }}>
                        <Text style={{ fontSize: 8 }}>Total Participant</Text>
                        <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{totalParticipant}</Text>
                    </View>
                </View>

                {/* the table in mention here */}
                <View style={{ marginTop: 20, borderWidth: 1, borderColor: '#000', borderStyle: 'solid', width: 515, alignSelf: 'center' }}>
                    {/* Table Header */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#000' }}>
                        <View style={{ width: 135, borderRightWidth: 1, borderColor: '#fff', padding: 8 }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 8 }}>PILLARS</Text>
                        </View>
                        <View style={{ width: 40, borderRightWidth: 1, borderColor: '#fff', padding: 8 }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 8 }}>No</Text>
                        </View>
                        <View style={{ width: 150, borderRightWidth: 1, borderColor: '#fff', padding: 8 }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 8 }}>NADI X</Text>
                        </View>
                        <View style={{ width: 90, borderRightWidth: 1, borderColor: '#fff', padding: 8, textAlign: 'center' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 8 }}>NO OF PROGRAMME</Text>
                        </View>
                        <View style={{ width: 100, padding: 8, textAlign: 'center' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 8 }}>NO OF PARTICIPATION</Text>
                        </View>
                    </View>
                    {/* Table Body */}
                    {pillarData.map((pillar, pillarIdx) => (
                        <View key={pillar.pillar} style={{ flexDirection: 'row', alignItems: 'stretch' }}>
                            {/* Pillar cell with row span effect */}
                            <View style={{ width: 135, borderRightWidth: 1, borderColor: '#000', borderTopWidth: pillarIdx === 0 ? 0 : 1, borderStyle: 'solid', justifyContent: 'center', alignItems: 'flex-start', padding: 8 }}>
                                <Text style={{ fontWeight: 'normal', fontSize: 8 }}>{pillar.pillar}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                {pillar.programs.map((program, progIdx) => (
                                    <View key={program.name} style={{ flexDirection: 'row', borderTopWidth: progIdx === 0 && pillarIdx === 0 ? 0 : 1, borderColor: '#000', borderStyle: 'solid' }}>
                                        {/* Program number and name */}
                                        <View style={{ width: 40, borderRightWidth: 1, borderColor: '#000', padding: 8, textAlign: 'center' }}>
                                            <Text style={{ fontSize: 8 }}>{progIdx + 1}</Text>
                                        </View>
                                        <View style={{ width: 150, borderRightWidth: 1, borderColor: '#000', padding: 8 }}>
                                            <Text style={{ fontSize: 8 }}>{program.name}</Text>
                                        </View>
                                        <View style={{ width: 90, borderRightWidth: 1, borderColor: '#000', padding: 8, textAlign: 'center' }}>
                                            <Text style={{ fontSize: 8 }}>{program.no_of_programme !== null ? program.no_of_programme : '-'}</Text>
                                        </View>
                                        <View style={{ width: 100, padding: 8, textAlign: 'center' }}>
                                            <Text style={{ fontSize: 8 }}>{program.no_of_participation !== null ? program.no_of_participation : '-'}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
                <PDFFooter />
            </Page>
            {/* Page 2 - PROGRAMME IMPLEMENTED */}
            <Page size="A4" style={styles.page}>
                <PDFSectionTitle title="7.1 SMART SERVICES" />
                <View style={{ marginBottom: 6, marginTop: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 9, textAlign: 'center' }}>
                        LIST OF PROGRAMS IMPLEMENTED THROUGHOUT {periodValue}
                    </Text>
                </View>
                {/* here */}
                <PDFTable
                    data={programmeImplementedData.slice(0, 20)}
                    columns={[
                        { header: "NO", key: (_, i) => `${i + 1}.`, width: "5%" },
                        { header: "NADI & STATE", key: row => `${row.sitename}, ${row.state}` },
                        { header: "PROGRAMME", key: "programme_name" },
                        { header: "DATE", key: "programme_date" },
                        { header: "TIME", key: "programme_name" },
                        { header: "METHOD", key: "programme_method" },
                        { header: "NO OF PARTICIPANTS", key: "programme_participation" },
                    ]}
                />
                <PDFFooter />
            </Page>

            {/* Page 3 - PARTICIPATION LIST */}
            <Page size="A4" style={styles.page}>
                <PDFSectionTitle title="7.1 SMART SERVICES" />
                <View style={{ marginBottom: 6, marginTop: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 9, textAlign: 'center' }}>
                        LIST OF PARTICIPICATION THROUGHOUT {periodValue}
                    </Text>
                </View>
                <PDFTable
                    data={programmeParticipationData.slice(0, 20)}
                    columns={[
                        { header: "NO", key: (_, i) => `${i + 1}.`, width: "5%" },
                        { header: "PROGRAMME", key: "programme_name" },
                        { header: "DATE", key: "programme_date" },
                        { header: "NAME / NRIC NO",key: row => (<><Text>{row.participant_name}</Text><Text>{row.participant_ic}</Text></>)},
                        { header: "PHONE NO", key: "participant_phone" },
                        { header: "MEMBERSHIP", key: "participant_membership" },
                        { header: "AGE", key: "participant_age" },
                        { header: "GENDER", key: "participant_gender" },
                        { header: "RACE", key: "participant_race" },
                        { header: "OKU", key: "participant_oku" },
                    ]}
                />
                <PDFFooter />
            </Page>
        </Document>
    );
};
