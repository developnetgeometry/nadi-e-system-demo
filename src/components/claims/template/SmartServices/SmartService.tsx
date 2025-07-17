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
    PDFMetaSection2,
    PDFHeader
} from "../component/pdf-component";
// Import the actual data fetching functions, not hooks
import { fetchPhaseData } from "@/hooks/use-phase";
import { fetchSmartServiceDataBySite } from "./hook/use-smart-service-data";
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
    uploadAttachment?: File | null;
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
    dusplogo = null,
    uploadAttachment = null,

}: SmartServiceProps): Promise<File> => {
    // Fetch data grouped by site
    let siteDataArray = [];
    
    try {
        siteDataArray = await fetchSmartServiceDataBySite({
            startDate,
            endDate,
            duspFilter,
            phaseFilter,
            nadiFilter,
            tpFilter
        });
        
        console.log("Site data array:", siteDataArray);
        
    } catch (error) {
        console.error("Error fetching smart service data by site:", error);
        // If fetch completely fails, use empty data
        siteDataArray = [];
    }

    // Fetch phase info if phaseFilter is provided
    const { phase } = await fetchPhaseData(phaseFilter);
    console.log("Phase data:", phase);
    const phaseLabel = phase?.name || "All Phases";

    // Helper function to create pages for a specific site
    const createSitePages = (siteData, siteIndex) => {
        const { siteInfo, pillarData, programmeImplementedData, programmeParticipationData } = siteData;
        
        // Calculate total program and participant for this site
        const totalProgram = pillarData.reduce((sum, pillar) => sum + pillar.programs.reduce((s, p) => s + (p.no_of_programme || 0), 0), 0);
        const totalParticipant = pillarData.reduce((sum, pillar) => sum + pillar.programs.reduce((s, p) => s + (p.no_of_participation || 0), 0), 0);

        // Flatten programmeImplementedData for the pictures table
        const pictureRows = programmeImplementedData.flatMap((item) =>
            (item.attachments_path || [])
                .filter((imgUrl) => typeof imgUrl === 'string' && imgUrl.trim() !== '')
                .map((imgUrl) => ({
                    ...item,
                    picture_url: imgUrl,
                }))
        );

        return [
            // Page 1: Main table for this site
            <Page key={`site-${siteIndex}-main`} size="A4" style={styles.page}>
                {header && (
                    <>
                        <PDFHeader
                            mcmcLogo={"/MCMC_Logo.png"}
                            duspLogo={dusplogo}
                        />

                        <View style={{ textAlign: "center", marginTop: -10, marginBottom: 20 }}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                textAlign: "center",
                                textTransform: "uppercase"
                            }}>
                                NADI SMART SERVICES
                            </Text>
                        </View>

                        <PDFMetaSection2
                            title="NADI SMART SERVICE PROGRAM IMPLEMENTATION STATUS REPORT"
                            claimType={claimType}
                            quater={quater}
                            startDate={startDate}
                            endDate={endDate}
                            phaseLabel={phaseLabel}
                            nadiName={siteInfo.nadiName}
                            refId={siteInfo.refId}
                            siteCode={siteInfo.siteCode}
                            state={siteInfo.state}
                        />

                        <View style={{ textAlign: "center", marginTop: 5 }}>
                            <Text style={{
                                textAlign: "center",
                                fontWeight: "bold"
                            }}>
                                Status Report: NADI Smart Service Program Implementation & Participation for {claimType?.toLowerCase() === 'quarterly' ? `Q${quater}'${new Date().getFullYear()}` : claimType?.toLowerCase() === 'monthly' ? `${new Date(startDate || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : `${new Date().getFullYear()}`}
                            </Text>
                        </View>
                    </>
                )}

                {!header && (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                            {siteInfo.nadiName} - {siteInfo.state}
                        </Text>
                        <Text style={{ fontSize: 10, textAlign: 'center' }}>
                            Site Code: {siteInfo.siteCode} | Ref ID: {siteInfo.refId}
                        </Text>
                    </View>
                )}

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
                            <View style={{ width: 135, borderRightWidth: 1, borderColor: '#000', borderTopWidth: pillarIdx === 0 ? 0 : 1, borderStyle: 'solid', justifyContent: 'center', alignItems: 'flex-start', padding: 8 }}>
                                <Text style={{ fontWeight: 'normal', fontSize: 8 }}>{pillar.pillar}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                {pillar.programs.map((program, progIdx) => (
                                    <View key={program.name} style={{ flexDirection: 'row', borderTopWidth: progIdx === 0 && pillarIdx === 0 ? 0 : 1, borderColor: '#000', borderStyle: 'solid' }}>
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
            </Page>,

            // Page 2: Programme implemented for this site
            <Page key={`site-${siteIndex}-implemented`} size="A4" style={styles.page}>
                <PDFSectionTitle title="7.1 SMART SERVICES" />

                <View style={{ marginBottom: 6, marginTop: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 9, textAlign: 'center' }}>
                        LIST OF PROGRAMS IMPLEMENTED - {siteInfo.nadiName}
                    </Text>
                </View>

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

                <PDFFooter />
            </Page>,

            // Page 3: Programme participation for this site
            <Page key={`site-${siteIndex}-participation`} size="A4" orientation="landscape" style={styles.page}>
                <PDFSectionTitle title="7.1 SMART SERVICES" />

                <View style={{ marginBottom: 6, marginTop: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 9, textAlign: 'center' }}>
                        LIST OF PARTICIPATION - {siteInfo.nadiName}
                    </Text>
                </View>

                <PDFTable
                    data={programmeParticipationData}
                    columns={[
                        { key: (_, i) => `${i + 1}.`, header: "NO", width: "5%" },
                        { key: "programme_name", header: "PROGRAMME", width: "15%" },
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

                <PDFFooter />
            </Page>,

            // Page 4: Pictures for this site
            <Page key={`site-${siteIndex}-pictures`} size="A4" orientation="landscape" style={styles.page}>
                <PDFSectionTitle title="7.1 SMART SERVICES" />

                <View style={{ marginBottom: 6, marginTop: 6 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 9, textAlign: 'center' }}>
                        PICTURES OF PROGRAMME IMPLEMENTATION - {siteInfo.nadiName}
                    </Text>
                </View>

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

                <PDFFooter />
            </Page>
        ];
    };

    // Define the PDF document with pages for each site
    const SmartServiceDoc = (
        <Document>
            {siteDataArray.length > 0 ? (
                siteDataArray.flatMap((siteData, index) => createSitePages(siteData, index))
            ) : (
                <Page size="A4" style={styles.page}>
                    <Text style={{ textAlign: 'center', marginTop: 100 }}>
                        No site data available.
                    </Text>
                </Page>
            )}
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