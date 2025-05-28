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
import { CMSSite, PortalWebServiceSite } from "@/hooks/report/use-nadi-e-system-pdf-data";

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

interface NadiESystemReportPDFProps {
    duspLabel: string;
    phaseLabel: string;
    periodType: string;
    periodValue: string;
    cms: CMSSite[];
    portalwebservice:PortalWebServiceSite[];
    mcmcLogo: string;
    duspLogo: string;
}

// PDF Document Component
export const NadiESystemReportPDF: React.FC<NadiESystemReportPDFProps> = ({
    duspLabel,
    phaseLabel,
    periodType,
    periodValue,
    cms,
    portalwebservice,
    mcmcLogo,
    duspLogo,
}) => {

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
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{cms.length}</Text>
                        </View>
                        <View style={{ ...styles.totalBox, padding: 10, width: 80, marginVertical: 0, marginLeft: 10 }}>
                            <Text style={{ fontSize: 8 }}>Total Installed</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{cms.reduce((total, site) => total + (Number(site.pc_client_count) || 0), 0)}</Text>
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
                {cms && cms.length > 0 ? (
                    <PDFTable
                        data={cms}
                        columns={[
                            {
                                key: (_, i) => `${i + 1}.`,
                                header: "NO",
                                width: "5%"
                            },
                            {
                                key: "sitename",
                                header: "NADI",
                            },
                            {
                                key: "state",
                                header: "STATE",
                                width: "20%"
                            },
                            {
                                key: "pc_client_count",
                                header: "QTY CMS PC CLIENT",
                                width: "20%"
                            },
                            {
                                key: "date_install",
                                header: "DATE INSTALL",
                                width: "20%"
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
                        <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>{portalwebservice.length}</Text>
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
                {portalwebservice && portalwebservice.length > 0 ? (
                    <PDFTable
                        data={portalwebservice}
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
