import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    pdf,
    Image,
} from "@react-pdf/renderer";
import { PDFFooter, PDFHeader } from "../component/pdf-component";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        paddingTop: 120, // Add padding to move the header down
        fontSize: 10,
        fontFamily: "Helvetica",
        position: "relative",
    },
    headerContainer: {
        marginTop: 100,
        textAlign: "center",
    },
    titleContainer: {
        marginTop: 60, // Space below the logos
        textAlign: "center",
    },
    titleText: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    subtitleText: {
        fontSize: 12,
        marginTop: 6,
        textAlign: "center",
    },
});

type FrontPageProps = {
    duspName: string;
    claimType: string;
    year: number;
    quarter?: number;
    month?: number;
    dusplogo?: string | null;
};

const FrontPage = async ({
    duspName,
    claimType,
    year,
    quarter = null,
    month = null,
    dusplogo = null,
}: FrontPageProps): Promise<File> => {
    // Format the report title based on claimType
    const formatMonth = (month: number) => {
        const monthNames = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
        ];
        return monthNames[month - 1];
    };

    let reportTitle = "";
    if (claimType === "YEARLY") {
        reportTitle = `${year} ${claimType} REPORT`;
    } else if (claimType === "QUARTERLY" && quarter) {
        reportTitle = `QUARTER ${quarter} ${year} REPORT`;
    } else if (claimType === "MONTHLY" && month && quarter) {
        reportTitle = `${formatMonth(month)} QUARTER ${quarter} ${year} REPORT`;
    }

    // Define the PDF document
    const FrontPageDoc = (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <PDFHeader
                    mcmcLogo={"/MCMC_Logo.png"} // Replace with actual MCMC logo if needed
                    duspLogo={dusplogo} // Use provided DUSP logo or placeholder
                />

                {/* DUSP Name */}
                <View style={styles.headerContainer}>
                    <Text style={styles.titleText}>{duspName}</Text>
                </View>

                {/* Report Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{reportTitle}</Text>
                </View>

                {/* Footer */}
                <PDFFooter />
            </Page>
        </Document>
    );

    // Create a blob from the PDF document
    const reportBlob = await pdf(FrontPageDoc).toBlob();

    // Generate filename based on filters
    const fileName = `front-page-${claimType}-${year}.pdf`;

    // Convert blob to File object with metadata
    return new File([reportBlob], fileName, {
        type: "application/pdf",
        lastModified: Date.now(),
    });
};

export default FrontPage;