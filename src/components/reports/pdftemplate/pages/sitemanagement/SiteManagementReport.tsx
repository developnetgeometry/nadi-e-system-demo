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
    },
    utilityChecked: {
        width: 12,
        height: 12,
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "solid",
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
};

type Audit = {
    standard_code: string; // Standard code instead of refid
    site_name: string;
    state: string;
};

type Agreement = {
    standard_code: string; // Standard code instead of refid
    site_name: string;
    state: string;
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
    periodType,
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

                {/* Section 2.1 Local Authority */}                <PDFSectionTitle title="2.1 LOCAL AUTHORITY" />

                <View style={styles.totalBox}>
                    <Text>Total NADI{"\n"}{localAuthoritySites}</Text> // total NADI sites have authority
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

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                    <View style={styles.totalBox}>
                        <Text>Total NADI{"\n"}{insuranceSites}</Text> // total NADI sites with insurance
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
                                width: "15%"
                            },
                            {
                                key: "site_name",
                                header: "NADI",
                                width: "40%"
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
                        ]}
                    />
                ) : (
                    <Text>No insurance data available.</Text>
                )}

                <PDFFooter />
            </Page>

            {/* Page 3: APPENDIX 1 SITE INSURANCE */}
            <Page size="A4" style={styles.page}>
                <PDFAppendixTitlePage
                    appendixNumber="APPENDIX 1"
                    title="SITE INSURANCE"
                />
                <PDFFooter />
            </Page>

            {/* Page 4: Audits */}
            <Page size="A4" style={styles.page}>                <PDFSectionTitle title="2.3 AUDITS" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                    <View style={styles.totalBox}>
                        <Text>Total NADI{"\n"}{auditSites}</Text> // total NADI sites with audits
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
                    ]}
                />
                ) : (
                    <Text>No audit data available.</Text>
                )}                <PDFFooter />
            </Page>            {/* Page 5: APPENDIX 2 AUDIT */}
            <Page size="A4" style={styles.page}>
                <PDFAppendixTitlePage
                    appendixNumber="APPENDIX 2"
                    title="SITE AUDIT"
                />
                <PDFFooter />
            </Page>

            {/* Page 6: Agreements */}
            <Page size="A4" style={styles.page}>

                <PDFSectionTitle title="2.5 AGREEMENTS" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                    <View style={styles.totalBox}>
                        <Text>Total NADI{"\n"}{agreementSites}</Text> // total NADI sites with agreements
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
                    ]}
                />
                ) : (
                    <Text>No agreement data available.</Text>
                )}                <PDFFooter />
            </Page>            {/* Page 7: APPENDIX 3 AGREEMENT */}
            <Page size="A4" style={styles.page}>
                <PDFAppendixTitlePage
                    appendixNumber="APPENDIX 3"
                    title="SITE AGREEMENT"
                />
                <PDFFooter />
            </Page>

            {/* Page 8: Utilities */}
            <Page size="A4" style={styles.page}>                
                <PDFSectionTitle title="2.4 UTILITIES (WATER, ELECTRICITY, SEWERAGE)" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                    <View style={styles.totalBox}>
                        <Text>Total NADI{"\n"}{utilitySites}</Text> // total NADI sites with utilities
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
                ) : (
                    <Text>No utility data available.</Text>
                )}

                <PDFFooter />
            </Page>

            {/* Page 9: Awareness Programmes */}
            <Page size="A4" style={styles.page}>                <PDFSectionTitle title="2.6 AWARENESS PROGRAMMES" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                    <View style={styles.totalBox}>
                        <Text>Total NADI{"\n"}{programmeSites}</Text> // total NADI sites with awareness programmes
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
                )}
                <PDFFooter />
            </Page>            {/* Page 10: APPENDIX 4 AWARENESS PROGRAMMES */}
            <Page size="A4" style={styles.page}>
                <PDFAppendixTitlePage
                    appendixNumber="APPENDIX 4"
                    title={"AWARENESS & PROMOTION\nPROGRAMME REPORT"}
                />
                <PDFFooter />
            </Page>
        </Document>
    );
};
