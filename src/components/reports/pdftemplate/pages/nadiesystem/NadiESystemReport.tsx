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

// PDF styles for NADI E-System report
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: "Helvetica",
        position: "relative",
    },    totalBox: {
        padding: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#000",
        marginVertical: 10,
    }
});

// Types
interface NadiESystemSite {
    id?: string | number;
    siteId?: string | number;
    standard_code?: string;
    sitename?: string;
    phase_id?: string | number;
    phase_name?: string;
    dusp_id?: string | number;
    dusp_name?: string;
    state?: string;
    has_cms?: boolean;
    pc_client_count?: number;
    date_install?: string;
    website_migrated?: boolean;
    url_portal?: string;
    email_migrated?: boolean;
    email_staff?: string[];
}

interface NadiESystemReportPDFProps {
    duspLabel: string;
    phaseLabel: string;
    periodType: string;
    periodValue: string;
    sites: NadiESystemSite[];
    totalSites: number;
    sitesWithCms: number;
    sitesWithWebsiteMigration: number;
    sitesWithEmailMigration: number;
    mcmcLogo: string;
    duspLogo: string;
}

// PDF Document Component
export const NadiESystemReportPDF: React.FC<NadiESystemReportPDFProps> = ({
    duspLabel,
    phaseLabel,
    periodType,
    periodValue, sites,
    totalSites,
    sitesWithCms,
    sitesWithWebsiteMigration,
    sitesWithEmailMigration,
    mcmcLogo,
    duspLogo,
}) => {
    // Calculate percentages
    const cmsPercentage = totalSites > 0 ? Math.round((sitesWithCms / totalSites) * 100) : 0;
    const websitePercentage = totalSites > 0 ? Math.round((sitesWithWebsiteMigration / totalSites) * 100) : 0;
    const emailPercentage = totalSites > 0 ? Math.round((sitesWithEmailMigration / totalSites) * 100) : 0;

    return (
        <Document>
            {/* CMS Page */}
            <Page size="A4" style={styles.page}>
                <PDFHeader
                    mcmcLogo={mcmcLogo}
                    duspLogo={duspLogo}
                />

                <PDFMetaSection
                    reportTitle="NADI e-System Report"
                    phaseLabel={phaseLabel}
                    periodType={periodType}
                    periodValue={periodValue}
                />

                <PDFSectionTitle title="3.1 CMS" />

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, position: "relative" }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ ...styles.totalBox, padding: 10, width: 80, marginVertical: 0 }}>
                            <Text style={{ fontSize: 8 }}>Total NADI</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{totalSites}</Text>
                        </View>
                        <View style={{ ...styles.totalBox, padding: 10, width: 80, marginVertical: 0, marginLeft: 10 }}>
                            <Text style={{ fontSize: 8 }}>Total Installed</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{sitesWithCms}</Text>
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

                {/* CMS Table */}
                {sites && sites.length > 0 ? (
                    <PDFTable
                        data={sites.filter(site => site.has_cms)}
                        columns={[
                            {
                                key: (_, i) => `${i + 1}.`,
                                header: "NO",
                                width: "5%"
                            },
                            {
                                key: "sitename",
                                header: "NADI",
                                width: "30%"
                            },
                            {
                                key: "state",
                                header: "STATE",
                                width: "15%"
                            },
                            {
                                key: "pc_client_count",
                                header: "QTY CMS PC CLIENT",
                                width: "25%"
                            },
                            {
                                key: "date_install",
                                header: "DATE INSTALL",
                                width: "25%"
                            }
                        ]}
                    />
                ) : (
                    <Text>No CMS data available</Text>
                )}
                <PDFFooter />
            </Page>

              {/* Portal & Email Page */}  
            <Page size="A4" style={styles.page}>
                <View style={{ marginTop: 20 }}>
                    <PDFSectionTitle title="3.2 PORTAL & WEB SERVICES (EMAIL)" />
                </View>

                {/* Display total box with phase & quarter info as shown in the template */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                    <View style={{ ...styles.totalBox, padding: 10, width: 80, marginVertical: 0 }}>
                        <Text style={{ fontSize: 8 }}>Total NADI</Text>
                        <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{totalSites}</Text>
                    </View>
                    <View style={{ alignSelf: "flex-end" }}>
                        <PDFPhaseQuarterInfo
                            phaseLabel={phaseLabel}
                            periodType={periodType}
                            periodValue={periodValue}
                        />
                    </View>
                </View>

                
                {/* Portal & Email Table */}
                {sites && sites.length > 0 ? (
                    <PDFTable
                        data={sites.filter(site => site.website_migrated || site.email_migrated)}
                        columns={[
                            {
                                key: (_, i) => `${i + 1}.`,
                                header: "NO",
                                width: "5%"
                            },
                            {
                                key: "sitename",
                                header: "NADI",
                                width: "25%"
                            },
                            {
                                key: "state",
                                header: "STATE",
                                width: "15%"
                            },
                            {
                                key: "url_portal",
                                header: "URL PORTAL",
                                width: "25%"
                            },
                            {
                                key: "email_staff",
                                header: "EMAIL STAFF",
                                width: "30%",
                                render: (value) => value ? value.join("; ") : "-"
                            }
                        ]}
                    />
                ) : (
                    <Text>No portal and email data available</Text>                )}
                <PDFFooter />
            </Page>
        </Document>
    );
};
