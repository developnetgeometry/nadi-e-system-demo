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
import fetchSmartServiceData from "./hook/use-smart-service-data";
// Import PDF utilities
import { generatePdfFilename } from "../component/pdf-utils";


const styles = StyleSheet.create({
    page: {
        padding: 40,
        paddingBottom: 80, // <-- Increased bottom padding to avoid overlap with footer
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

type SmartServiceProps = {
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
const SmartService = async ({
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

}: SmartServiceProps): Promise<File> => {
    // Fetch SmartService data based on filters
    const { pillarData, programmeImplementedData, programmeParticipationData } = await fetchSmartServiceData({
        startDate,
        endDate,
        duspFilter,
        phaseFilter,
        nadiFilter,
        tpFilter
    });
    console.log("pillarData data:", pillarData);
    console.log("programmeImplementedData data:", programmeImplementedData);
    console.log("programmeParticipationData data:", programmeParticipationData);
    // Calculate total program and participant
    const totalProgram = pillarData.reduce((sum, pillar) => sum + pillar.programs.reduce((s, p) => s + (p.no_of_programme || 0), 0), 0);
    const totalParticipant = pillarData.reduce((sum, pillar) => sum + pillar.programs.reduce((s, p) => s + (p.no_of_participation || 0), 0), 0);


    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    console.log("Phase data:", phase);
    const phaseLabel = phase?.name || "All Phases";

    // Flatten programmeImplementedData for the pictures table, only include rows with a valid image
    const pictureRows = programmeImplementedData.flatMap((item) =>
        (item.attachments_path || [])
            .filter((imgUrl) => typeof imgUrl === 'string' && imgUrl.trim() !== '')
            .map((imgUrl) => ({
                ...item,
                picture_url: imgUrl,
            }))
    );    // Define the PDF document (only the main report pages)
    const SmartServiceDoc = (
        <Document>
            {/* Page 1: SmartService */}
            <Page size="A4" style={styles.page}>
                {header && (
                    <>
                        <PDFHeader
                            mcmcLogo={"/MCMC_Logo.png"} // Replace with actual MCMC logo if needed
                            duspLogo={dusplogo} // Use provided DUSP logo or placeholder
                        />
                        <PDFMetaSection
                            reportTitle="7.0 Smart Services"
                            phaseLabel={phaseLabel}
                            claimType={claimType}
                            quater={quater}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </>
                )}

                <PDFSectionTitle title="7.1 SMART SERVICES" />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ alignSelf: "flex-start", flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                        <View style={{ ...styles.totalBox }}>
                            {/* Total Program with SMART SERVICES */}
                            <Text>Total{"\n"}Program</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{totalProgram}</Text>
                        </View>
                        <View style={{ ...styles.totalBox }}>
                            {/* Total Participant with SMART SERVICES */}
                            <Text>Total{"\n"}Participant</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>{totalParticipant}</Text>
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

                {/* table */}
                <View style={{ marginTop: 20, borderWidth: 1, borderColor: '#000', borderStyle: 'solid', width: 515, alignSelf: 'center' }}>
                    {/* Table Header */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#000' }}>
                        <View style={{ width: 135, borderRightWidth: 1, borderColor: '#fff', padding: 8 }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 8 }}>PILLARS</Text>
                        </View>
                        <View style={{ width: 40, borderRightWidth: 1, borderColor: '#fff', padding: 8, textAlign: 'center' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 8 }}></Text>
                        </View>
                        <View style={{ width: 150, borderRightWidth: 1, borderColor: '#fff', padding: 8 }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 8 }}>NADI X</Text>
                        </View>
                        <View style={{ width: 90, borderRightWidth: 1, borderColor: '#fff', padding: 8, textAlign: 'center' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 8 }}>NO OF{"\n"}PROGRAMME</Text>
                        </View>
                        <View style={{ width: 100, padding: 8, textAlign: 'center' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 8 }}>NO OF{"\n"}PARTICIPATION</Text>
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

                <PDFFooter /> {/* Keep as fixed, but paddingBottom prevents overlap */}
            </Page>

            {/* programme implemented data page */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="7.1 SMART SERVICES" />

                <View style={{ marginBottom: 6, marginTop: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 9, textAlign: 'center' }}>
                        LIST OF PROGRAMS IMPLEMENTED
                    </Text>
                </View>

                {programmeImplementedData.length > 0 ? (
                    <PDFTable
                        data={programmeImplementedData}
                        columns={[
                            { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                            { key: "programme_name", header: "PROGRAMME" },
                            { key: "programme_date", header: "DATE" },
                            { key: "programme_time", header: "TIME" },
                            { key: "programme_method", header: "METHOD" },
                            { key: "programme_participation", header: "NO OF\nPARTICIPATION" },
                        ]}
                    />
                ) : (
                    <Text>No programme data available.</Text>
                )}

                <PDFFooter /> {/* Keep as fixed, but paddingBottom prevents overlap */}
            </Page>

            {/* programme participation data page */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="7.1 SMART SERVICES" />

                <View style={{ marginBottom: 6, marginTop: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 9, textAlign: 'center' }}>
                        LIST OF PARTICIPICATION
                    </Text>
                </View>

                {programmeParticipationData.length > 0 ? (
                    <PDFTable
                        data={programmeParticipationData}
                        columns={[
                            { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                            { key: "programme_name", header: "PROGRAMME", width: "15%" },
                            // { key: "programme_date", header: "DATE" },
                            { key: "participant_name", header: "NAME" },
                            { key: "participant_ic", header: "NRIC" },
                            { key: "participant_phone", header: "PHONE", width: "10%" },
                            { key: "participant_membership", header: "MEMBERSHIP" },
                            { key: "participant_age", header: "AGE", width: "6%" },
                            { key: "participant_gender", header: "GENDER", width: "10%" },
                            { key: "participant_race", header: "RACE", width: "6%" },
                            { key: "participant_oku", header: "OKU", width: "6%" },
                        ]}
                    />
                ) : (
                    <Text>No programme participant data available.</Text>
                )}

                <PDFFooter /> {/* Keep as fixed, but paddingBottom prevents overlap */}
            </Page>

            {/* PICTURES OF PROGRAMME IMPLEMENTATION page */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="7.1 SMART SERVICES" />

                <View style={{ marginBottom: 6, marginTop: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 9, textAlign: 'center' }}>
                        PICTURES OF PROGRAMME IMPLEMENTATION
                    </Text>
                </View>

                {pictureRows.length > 0 ? (
                    <PDFTable
                        data={pictureRows}
                        columns={[
                            { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                            {
                                key: "picture_url",
                                header: "PICTURE",
                                width: "45%",
                                render: (value) => (
                                    <View style={{ width: 180, height: 140, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', display: 'flex' }}>
                                        <Image src={value} style={{ width: 180, height: 140, objectFit: 'contain' }} />
                                    </View>
                                ),
                            },
                            { key: "programme_name", header: "PROGRAMME" },
                            { key: "programme_date", header: "DATE" },
                            { key: "programme_remarks", header: "REMARK" },
                        ]}
                    />
                ) : (
                    <Text>No programme data available.</Text>
                )}

                <PDFFooter /> {/* Keep as fixed, but paddingBottom prevents overlap */}
            </Page>

        </Document>
    );
    // Create a blob from the PDF document (main report and appendix title page)
    const reportBlob = await pdf(SmartServiceDoc).toBlob();

    // Generate filename based on filters
    const fileName = generatePdfFilename('smart-service-report', claimType, phase?.name);

    // Convert blob to File object with metadata
    return new File([reportBlob], fileName, {
        type: 'application/pdf',
        lastModified: Date.now()
    });
}

export default SmartService;