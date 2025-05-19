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
    PDFSectionTitle
} from "../../components/PDFComponents";

// PDF styles for Site Management report
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
        border: "1pt solid #000",
        marginBottom: 10,
        marginTop: 5,
        maxWidth: 170,
        textAlign: "center",
        fontSize: 12,
    },
    phaseInfoBox: {
        position: "absolute",
        right: 40,
        top: 210,
        padding: 4,
        fontSize: 8,
        textAlign: "right",
    },
    utilityCheckbox: {
        width: 12,
        height: 12,
        border: "1pt solid #000",
        margin: "auto",
    },
    utilityChecked: {
        width: 12,
        height: 12,
        border: "1pt solid #000",
        backgroundColor: "#000",
        margin: "auto",
    },
    appendixTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    }
});

// Define data types for the Site Management Report
type Site = {
    standard_code: string; // Standard code instead of refid
    name: string;  // Site Name
    state: string; // State where site is located
};

type Utility = {
    site_id: string;
    site_name: string;
    state: string;
    has_water?: boolean;
    has_electricity?: boolean;
    has_sewerage?: boolean;
    type_name?: string;
    amount_bill?: number;
};

type Insurance = {
    standard_code: string; // Standard code instead of refid
    site_name: string;
    state: string;
    duration: string;
    status: string;
};

type Audit = {
    standard_code: string; // Standard code instead of refid
    site_name: string;
    state: string;
    audit_date: string;
    status: string;
};

type Agreement = {
    standard_code: string; // Standard code instead of refid
    site_name: string;
    state: string;
    start_date: string;
    end_date: string;
    status: string;
};

type AwarenessProgram = {
    standard_code: string; // Standard code instead of refid
    site_name: string;
    state: string;
    program_name: string;
    program_date: string;
    status: string;
};

type LocalAuthority = {
    standard_code: string; // Standard code instead of refid
    site_name: string;
    state: string;
    authority_name: string;
    reference_no: string;
    duration: string;
    status: string;
};

// Props for the Site Management Report PDF
type SiteManagementReportProps = {
    duspLabel?: string;
    phaseLabel?: string;
    periodType?: string;
    periodValue?: string;
    totalSites: number;
    mcmcLogo: string; // base64 or url
    duspLogo: string; // base64 or url
    sites: Site[];
    utilities: Utility[];
    insurance: Insurance[];
    localAuthority?: LocalAuthority[];
    audits: Audit[];
    agreements: Agreement[];
    programmes: AwarenessProgram[];
};

// The main PDF component for Site Management Report
export const SiteManagementReportPDF = ({
    duspLabel,
    phaseLabel,
    periodType = "QUARTER / YEAR",
    periodValue,
    totalSites,
    mcmcLogo,
    duspLogo,
    sites,
    utilities,
    insurance,
    localAuthority = [],
    audits,
    agreements,
    programmes,
}: SiteManagementReportProps) => {  // Calculate statistics
    const utilitySites = [...new Set(utilities.map(u => u.site_id))].length;
    const insuranceSites = [...new Set(insurance.map(i => i.standard_code))].length;
    const localAuthoritySites = [...new Set(localAuthority.map(la => la.standard_code))].length;
    const auditSites = [...new Set(audits.map(a => a.standard_code))].length;
    const agreementSites = [...new Set(agreements.map(a => a.standard_code))].length;
    const programmeSites = [...new Set(programmes.map(p => p.standard_code))].length;

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
                <PDFSectionTitle title="2.1 LOCAL AUTHORITY" />

                <View style={styles.totalBox}>
                    <Text>Total NADI{"\n"}{0}</Text> // total NADI sites have authority
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
                                width: "15%"
                            },
                            {
                                key: "site_name",
                                header: "NADI",
                                width: "55%"
                            },
                            {
                                key: "state",
                                header: "STATE",
                                width: "25%"
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

                <View style={styles.totalBox}>
                    <Text>Total NADI{"\n"}{insuranceSites}</Text> // total NADI sites with insurance
                </View>

                <View style={{ position: 'absolute', right: 40, top: 114, textAlign: 'right', fontSize: 8 }}>
                    <Text>PHASE: {phaseLabel || 'PILOT'}</Text>
                    <Text>QUARTER: {periodValue || '4/2024'}</Text>
                </View><PDFTable data={insurance}
                    columns={[
                        {
                            key: (_, i) => `${i + 1}.`,
                            header: "NO",
                            width: "5%"
                        },
                        {
                            key: "standard_code",
                            header: "SITE CODE",
                            width: "15%"
                        },
                        {
                            key: "site_name",
                            header: "NADI",
                            width: "25%"
                        },
                        {
                            key: "state",
                            header: "STATE",
                            width: "15%"
                        },
                        {
                            key: "duration",
                            header: "DURATION",
                            width: "25%"
                        },
                        {
                            key: "status",
                            header: "STATUS",
                            width: "15%"
                        },
                    ]}
                />

                <PDFFooter />
            </Page>
            {/* Page 3: APPENDIX 1 SITE INSURANCE */}
            {/* not implement page yet */}

            {/* Page 4: Audits */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="2.3 AUDITS" />

                <View style={styles.totalBox}>
                    <Text>Total NADI{"\n"}{auditSites}</Text> // total NADI sites with audits
                </View>

                <View style={{ position: 'absolute', right: 40, top: 114, textAlign: 'right', fontSize: 8 }}>
                    <Text>PHASE: {phaseLabel || 'PILOT'}</Text>
                    <Text>QUARTER: {periodValue || '4/2024'}</Text>
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
                            width: "15%"
                        },
                        {
                            key: "site_name",
                            header: "NADI",
                            width: "30%"
                        },
                        {
                            key: "state",
                            header: "STATE",
                            width: "15%"
                        },
                        {
                            key: "audit_date",
                            header: "DATE",
                            width: "20%"
                        },
                        {
                            key: "status",
                            header: "STATUS",
                            width: "15%"
                        },
                    ]}
                />
                ) : (
                    <Text>No audit data available.</Text>
                )}

                <PDFFooter />
            </Page>
            {/* Page 5: APPENDIX 2 AUDIT */}
            {/* not implement page yet */}

            {/* Page 6: Agreements */}
            <Page size="A4" style={styles.page}>
 
                <PDFSectionTitle title="2.5 AGREEMENTS" />

                <View style={styles.totalBox}>
                    <Text>Total NADI{"\n"}{agreementSites}</Text> // total NADI sites with agreements
                </View>

                <View style={{ position: 'absolute', right: 40, top: 114, textAlign: 'right', fontSize: 8 }}>
                    <Text>PHASE: {phaseLabel || 'PILOT'}</Text>
                    <Text>QUARTER: {periodValue || '4/2024'}</Text>
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
                            width: "15%"
                        },
                        {
                            key: "site_name",
                            header: "NADI",
                            width: "30%"
                        },
                        {
                            key: "state",
                            header: "STATE",
                            width: "15%"
                        },
                        {
                            key: "start_date",
                            header: "START DATE",
                            width: "15%"
                        },
                        {
                            key: "end_date",
                            header: "END DATE",
                            width: "15%"
                        },
                        {
                            key: "status",
                            header: "STATUS",
                            width: "15%"
                        },
                    ]}
                />
                ) : (
                    <Text>No agreement data available.</Text>
                )}

                <PDFFooter />
            </Page>
            {/* Page 7: APPENDIX 3 AGREEMENT */}
            {/* not implement page yet */}

            {/* Page 8: Utilities */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="2.4 UTILITIES (WATER, ELECTRICITY, SEWERAGE)" />

                <View style={styles.totalBox}>
                    <Text>Total NADI{"\n"}{utilitySites}</Text> // total NADI sites with utilities
                </View>

                <View style={{ position: 'absolute', right: 40, top: 114, textAlign: 'right', fontSize: 8 }}>
                    <Text>PHASE: {phaseLabel || 'PILOT'}</Text>
                    <Text>QUARTER: {periodValue || '4/2024'}</Text>
                </View>

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
                            width: "50%"
                        },
                        {
                            key: "state",
                            header: "STATE",
                            width: "15%"
                        },
                        {
                            key: (row) => row.has_water ? "OK" : "",
                            header: "WATER",
                            width: "10%"
                        },
                        {
                            key: (row) => row.has_electricity ? "OK" : "",
                            header: "ELECTRICITY",
                            width: "10%"
                        },
                        {
                            key: (row) => row.has_sewerage ? "OK" : "",
                            header: "SEWERAGE",
                            width: "10%"
                        },
                    ]}
                />

                <PDFFooter />
            </Page>

            {/* Page 9: Awareness Programmes */}
            <Page size="A4" style={styles.page}>
                <PDFSectionTitle title="2.6 AWARENESS PROGRAMMES" />

                <View style={styles.totalBox}>
                    <Text>Total NADI{"\n"}{programmeSites}</Text>
                </View>

                <View style={{ position: 'absolute', right: 40, top: 114, textAlign: 'right', fontSize: 8 }}>
                    <Text>PHASE: {phaseLabel || 'PILOT'}</Text>
                    <Text>QUARTER: {periodValue || '4/2024'}</Text>
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
                            width: "15%"
                        },
                        {
                            key: "site_name",
                            header: "NADI",
                            width: "30%"
                        },
                        {
                            key: "state",
                            header: "STATE",
                            width: "15%"
                        },
                        {
                            key: "program_name",
                            header: "PROGRAMME NAME",
                            width: "15%"
                        },
                        {
                            key: "program_date",
                            header: "DATE",
                            width: "20%"
                        },
                    ]}
                />
                ) : (
                    <Text>No awareness programme data available.</Text>
                )}                <PDFFooter />
            </Page>
        </Document>
    );
};
