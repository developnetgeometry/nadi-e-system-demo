import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
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
import { Site } from "@/types/site";
import { Agreement, Audit, AwarenessProgram, Insurance, LocalAuthority, Utility } from "@/hooks/report/use-site-management-pdf-data";

// PDF styles for Site Management report
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: "Helvetica",
        position: "relative",
    }, totalBox: {
        padding: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "solid",
        textAlign: "center",
        fontSize: 12,
        width: 170, /* Fixed width to match PDFPhaseQuarterInfo */
    },/* Removed phaseInfoBox style in favor of using PDFPhaseQuarterInfo component */
    utilityCheckbox: {
        width: 12,
        height: 12,
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "solid",
        margin: "auto",
    },    utilityChecked: {
        width: 12,
        height: 12,
        borderWidth: 1,
        borderColor: "#000",
    },    attachmentImage: {
        maxWidth: "100%",
        height: "auto",
        marginBottom: 10,
    },
    fullPageImage: {
        width: "100%",
        height: "auto",
        objectFit: "contain",
        objectPosition: "center"
    },
    attachmentCaption: {
        fontSize: 8,
        color: "#555",
        textAlign: "center",
        marginBottom: 15,
    },
    appendixTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    }
});

// Define data types for the Site Management Report


// Props for the Site Management Report PDF
type SiteManagementReportProps = {
    duspLabel?: string;
    phaseLabel?: string;
    periodType?: string;
    periodValue?: string;

    mcmcLogo: string; 
    duspLogo: string; 

    // Data arrays
    sites: Site[];
    utilities?: Utility[];
    insurance?: Insurance[];
    localAuthority?: LocalAuthority[];
    audits?: Audit[];
    agreements?: Agreement[];
    programmes?: AwarenessProgram[];
};

// The main PDF component for Site Management Report
export const SiteManagementReportPDF = ({
    duspLabel,
    phaseLabel,
    periodType,
    periodValue,
    mcmcLogo,
    duspLogo,    sites = [],
    utilities = [],
    insurance = [],
    localAuthority = [],
    audits = [],
    agreements = [],
    programmes = [],
}: SiteManagementReportProps) => {  // Calculate statistics
    // Safe access to data with null checks
    const utilitySites = utilities?.length ? [...new Set(utilities.map(u => u.site_id))].length : 0;
    const insuranceSites = insurance?.length ? [...new Set(insurance.map(i => i.standard_code))].length : 0;
    const localAuthoritySites = localAuthority?.length ? [...new Set(localAuthority.map(la => la.standard_code))].length : 0;
    const auditSites = audits?.length ? [...new Set(audits.map(a => a.standard_code))].length : 0;
    const agreementSites = agreements?.length ? [...new Set(agreements.map(a => a.standard_code))].length : 0;
    const programmeSites = programmes?.length ? [...new Set(programmes.map(p => p.standard_code))].length : 0;
    
    // Determine which appendices will be shown
    const hasInsuranceAttachments = insurance.some(ins => ins.attachments && ins.attachments.length > 0);
    const hasAuditAttachments = false; // Set to true when implemented
    const hasAgreementAttachments = false; // Set to true when implemented
    const hasProgrammeAttachments = false; // Set to true when implemented
    
    // Calculate appendix numbers dynamically
    let currentAppendixNumber = 1;
    const insuranceAppendixNumber = hasInsuranceAttachments ? currentAppendixNumber++ : null;
    const auditAppendixNumber = hasAuditAttachments ? currentAppendixNumber++ : null;
    const agreementAppendixNumber = hasAgreementAttachments ? currentAppendixNumber++ : null;
    const programmeAppendixNumber = hasProgrammeAttachments ? currentAppendixNumber : null;

    return (
        <Document>
            {/* Page 1: Local Authority */}
            <Page size="A4" style={styles.page}>
                {/* Header Component */}
                <PDFHeader mcmcLogo={mcmcLogo} duspLogo={duspLogo} />

                {/* Meta Section Component */}
                <PDFMetaSection
                    reportTitle="2.0 Site Management"
                    phaseLabel={phaseLabel}
                    periodType={periodType}
                    periodValue={periodValue}
                />

                {/* Section 2.1 Local Authority */}

                <PDFSectionTitle title="2.1 LOCAL AUTHORITY" />                <View style={styles.totalBox}>
                    {/* total NADI sites have authority */}
                    <Text>Total NADI{"\n"}{localAuthoritySites}</Text>
                </View>

                {localAuthority.length > 0 ?
                    (<PDFTable
                        data={localAuthority}
                        columns={[
                            {
                                key: (_, i) => `${i + 1}.`,
                                header: "NO",
                                width: "5%"
                            },
                            {
                                key: "standard_code",
                                header: "SITE CODE",
                            },
                            {
                                key: "site_name",
                                header: "NADI",

                            },
                            {
                                key: "state",
                                header: "STATE",
                            }
                        ]}
                    />
                    ) : (
                        <Text>No local authority data available.</Text>
                    )}

                {/* Footer Component */}
                <PDFFooter />
            </Page>

            {/* Page 2: Insurance */}
            <Page size="A4" style={styles.page}>
                <PDFSectionTitle title="2.2 INSURANCE" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>                    <View style={styles.totalBox}>
                        {/* total NADI sites with insurance */}
                        <Text>Total NADI{"\n"}{insuranceSites}</Text>
                    </View>
                    <View style={{ alignSelf: "flex-end" }}>
                        <PDFPhaseQuarterInfo
                            phaseLabel={phaseLabel}
                            periodType={periodType}
                            periodValue={periodValue}
                        />
                    </View>
                </View>

                {insurance.length > 0 ? (
                    <PDFTable
                        data={insurance}
                        columns={[
                            {
                                key: (_, i) => `${i + 1}.`,
                                header: "NO",
                                width: "5%"
                            },
                            {
                                key: "standard_code",
                                header: "SITE CODE",
                            },
                            {
                                key: "site_name",
                                header: "NADI",
                            },
                            {
                                key: "state",
                                header: "STATE",
                            },
                            {
                                key: "duration",
                                header: "DURATION",
                            },
                        ]}
                    />
                ) : (
                    <Text>No insurance data available.</Text>
                )}

                <PDFFooter />
            </Page>            {/* Page 3: APPENDIX for SITE INSURANCE - Only show if there are attachments */}
            {hasInsuranceAttachments && (
                <Page size="A4" style={styles.page}>
                    <PDFAppendixTitlePage
                        appendixNumber={`APPENDIX ${insuranceAppendixNumber}`}
                        title="SITE INSURANCE"
                    />
                    <PDFFooter />
                </Page>
            )}
              {/* Insurance Attachments Pages - One page per attachment */}
            {insurance.filter(ins => ins.attachments && ins.attachments.length > 0).flatMap((ins, index) => 
                ins.attachments.map((url, attIdx) => {
                    // Extract filename from URL path
                    const fileName = url.split('/').pop() || 'Insurance Document';
                    const cleanFileName = fileName.replace(/_\d+\.pdf$/, '.pdf');
                    
                    return (
                        <Page key={`insurance-attachment-${index}-${attIdx}`} size="A4" style={styles.page}>

                            <View style={{ marginBottom: 10, borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
                                <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 5 }}>
                                    Site: {ins.site_name} ({ins.standard_code}) - {ins.state}
                                </Text>
                                <Text style={{ fontSize: 10, textAlign: 'center' }}>
                                    Insurance Duration: {ins.duration}
                                </Text>
                            </View>
                            
                            {/* Display filename */}
                            <Text style={{ fontSize: 11, marginBottom: 10, textAlign: 'center' }}>
                                {cleanFileName}
                            </Text>
                            
                            {/* Display the attachment at full page */}
                            <View style={{ 
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '75%', // Take most of the page
                            }}>                                <Image 
                                    src={url}
                                    style={styles.fullPageImage}
                                />
                            </View>
                            
                            <PDFFooter />
                        </Page>
                    );
                })
            )}

            {/* Page 4: Audits */}
            <Page size="A4" style={styles.page}>
                <PDFSectionTitle title="2.3 AUDITS" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>                    <View style={styles.totalBox}>
                        {/* total NADI sites with audits */}
                        <Text>Total NADI{"\n"}{auditSites}</Text>
                    </View>
                    <View style={{ alignSelf: "flex-end" }}>
                        <PDFPhaseQuarterInfo
                            phaseLabel={phaseLabel}
                            periodType={periodType}
                            periodValue={periodValue}
                        />
                    </View>
                </View>

                {audits.length > 0 ? (<PDFTable
                    data={audits}
                    columns={[
                        {
                            key: (_, i) => `${i + 1}.`,
                            header: "NO",
                            width: "5%"
                        },
                        {
                            key: "standard_code",
                            header: "SITE CODE",
                        },
                        {
                            key: "site_name",
                            header: "NADI",
                        },
                        {
                            key: "state",
                            header: "STATE",
                        },
                    ]}
                />
                ) : (
                    <Text>No audit data available.</Text>
                )}
                <PDFFooter />
            </Page>            {/* Page 5: APPENDIX for AUDIT - Only show if there are audit attachments */}
            {hasAuditAttachments && (
                <Page size="A4" style={styles.page}>
                    <PDFAppendixTitlePage
                        appendixNumber={`APPENDIX ${auditAppendixNumber}`}
                        title="SITE AUDIT"
                    />
                    <PDFFooter />
                </Page>
            )}

            {/* Page 6: Agreements */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="2.5 AGREEMENTS" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>                    <View style={styles.totalBox}>
                        {/* total NADI sites with agreements */}
                        <Text>Total NADI{"\n"}{agreementSites}</Text>
                    </View>
                    <View style={{ alignSelf: "flex-end" }}>
                        <PDFPhaseQuarterInfo
                            phaseLabel={phaseLabel}
                            periodType={periodType}
                            periodValue={periodValue}
                        />
                    </View>
                </View>

                {agreements.length > 0 ? (<PDFTable
                    data={agreements}
                    columns={[
                        {
                            key: (_, i) => `${i + 1}.`,
                            header: "NO",
                            width: "5%"
                        },
                        {
                            key: "standard_code",
                            header: "SITE CODE",
                        },
                        {
                            key: "site_name",
                            header: "NADI",
                        },
                        {
                            key: "state",
                            header: "STATE",
                        },
                    ]}
                />                ) : (
                    <Text>No agreement data available.</Text>
                )}
                <PDFFooter />
            </Page>            {/* Page 7: APPENDIX for AGREEMENT - Only show if there are agreement attachments */}
            {hasAgreementAttachments && (
                <Page size="A4" style={styles.page}>
                    <PDFAppendixTitlePage
                        appendixNumber={`APPENDIX ${agreementAppendixNumber}`}
                        title="SITE AGREEMENT"
                    />
                    <PDFFooter />
                </Page>
            )}

            {/* Page 8: Utilities */}
            <Page size="A4" style={styles.page}>
                <PDFSectionTitle title="2.4 UTILITIES (WATER, ELECTRICITY, SEWERAGE)" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>                    <View style={styles.totalBox}>
                        {/* total NADI sites with utilities */}
                        <Text>Total NADI{"\n"}{utilitySites}</Text>
                    </View>
                    <View style={{ alignSelf: "flex-end" }}>
                        <PDFPhaseQuarterInfo
                            phaseLabel={phaseLabel}
                            periodType={periodType}
                            periodValue={periodValue}
                        />
                    </View>
                </View>

                {utilities.length > 0 ? (
                    <PDFTable
                        data={utilities}
                        columns={[
                            {
                                key: (_, i) => `${i + 1}.`,
                                header: "NO",
                                width: "5%"
                            },
                            {
                                key: "site_name",
                                header: "NADI",
                            },
                            {
                                key: "state",
                                header: "STATE",
                            },
                            {
                                key: (row) => row.has_water ? "OK" : "",
                                header: "WATER",
                            },
                            {
                                key: (row) => row.has_electricity ? "OK" : "",
                                header: "ELECTRICITY",
                            },
                            {
                                key: (row) => row.has_sewerage ? "OK" : "",
                                header: "SEWERAGE",
                            },
                        ]}
                    />
                ) : (
                    <Text>No utility data available.</Text>
                )}

                <PDFFooter />
            </Page>

            {/* Page 9: Awareness Programmes */}
            <Page size="A4" style={styles.page}>
                <PDFSectionTitle title="2.6 AWARENESS PROGRAMMES" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>                    <View style={styles.totalBox}>
                        {/* total NADI sites with awareness programmes */}
                        <Text>Total NADI{"\n"}{programmeSites}</Text>
                    </View>
                    <View style={{ alignSelf: "flex-end" }}>
                        <PDFPhaseQuarterInfo
                            phaseLabel={phaseLabel}
                            periodType={periodType}
                            periodValue={periodValue}
                        />
                    </View>
                </View>

                {programmes.length > 0 ? (<PDFTable
                    data={programmes}
                    columns={[
                        {
                            key: (_, i) => `${i + 1}.`,
                            header: "NO",
                            width: "5%"
                        },
                        {
                            key: "standard_code",
                            header: "STANDARD CODE",
                        },
                        {
                            key: "site_name",
                            header: "NADI",
                        },
                        {
                            key: "state",
                            header: "STATE",
                        },
                        {
                            key: "program_name",
                            header: "PROGRAMME NAME",
                        },
                        {
                            key: "program_date",
                            header: "DATE",
                        },
                    ]}
                />
                ) : (
                    <Text>No awareness programme data available.</Text>
                )}                <PDFFooter />
            </Page>            {/* Page 10: APPENDIX for AWARENESS PROGRAMMES - Only show if there are programme attachments */}
            {hasProgrammeAttachments && (
                <Page size="A4" style={styles.page}>
                    <PDFAppendixTitlePage
                        appendixNumber={`APPENDIX ${programmeAppendixNumber}`}
                        title={"AWARENESS & PROMOTION\nPROGRAMME REPORT"}
                    />
                    <PDFFooter />
                </Page>
            )}
        </Document>
    );
};
