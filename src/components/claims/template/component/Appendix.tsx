import React from "react";
import {
    Document,
    Page,
    StyleSheet,
    pdf,
} from "@react-pdf/renderer";
import { PDFFooter, PDFAppendixTitlePage } from "../component/pdf-component";
import { generateFinalPdf, AttachmentSource } from "../component/pdf-attachment-handler";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: "Helvetica",
        position: "relative",
    },
});

type AppendixProps = {
    appendixNumber: string;
    title: string;
    attachments: { path: string }[];
};

export default async function Appendix({
    appendixNumber,
    title,
    attachments,
}: AppendixProps): Promise<File> {
    // Define the appendix title page
    const appendixDoc = (
        <Document>
            <Page size="A4" style={styles.page}>
                <PDFAppendixTitlePage appendixNumber={appendixNumber} title={title} />
                <PDFFooter />
            </Page>
        </Document>
    );

    // Create a blob from the appendix title page
    const reportBlob = await pdf(appendixDoc).toBlob();

    // Process attachments as sources for generateFinalPdf
    const sources: AttachmentSource[] = attachments.map((attachment) => ({
        attachments_path: [attachment.path], // Wrap path in an array
        standard_code: title, // Use title as a placeholder for standard_code
    }));

    // Generate the final PDF by merging the appendix title page with attachment pages
    const finalPdfBlob = await generateFinalPdf(reportBlob, sources);

    // Generate filename based on appendix title
    const fileName = `appendix-${title.replace(/\s+/g, "-").toLowerCase()}.pdf`;

    // Convert blob to File object with metadata
    return new File([finalPdfBlob], fileName, {
        type: "application/pdf",
        lastModified: Date.now(),
    });
}