import { format, formatDate } from "date-fns";
import { jsPDF } from "jspdf";

export function footerNadiDocs(doc: jsPDF, date: Date) {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  const leftText = "This document is system-generated from NADI e-System.";
  const rightText = "Generated on " + format(date, "dd/MM/yyyy hh:mm:ss a");

  doc.setFont("Verdana", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100);

  doc.text(leftText, 15, pageHeight - 15);

  const rightTextWidth = doc.getTextWidth(rightText);
  const rightTextX = pageWidth - 15 - rightTextWidth;

  doc.text(rightText, rightTextX, pageHeight - 15);
}

export const getBase64ImageWithSize = async (
  url: string
): Promise<{ dataUrl: string; width: number; height: number }> => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        resolve({
          dataUrl: reader.result as string,
          width: img.width,
          height: img.height,
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(blob);
  });
};

export async function headerNadiDocs(doc: jsPDF, duspLogoUrl: string) {
  const [mcmcLogoData, duspLogoData] = await Promise.all([
    getBase64ImageWithSize(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/MCMC_Logo.png/1088px-MCMC_Logo.png"
    ),
    getBase64ImageWithSize(duspLogoUrl),
  ]);

  // MCMC logo
  const mcmcX = 15;
  const mcmcY = 10;
  const mcmcSize = 30;
  doc.addImage(mcmcLogoData.dataUrl, "JPEG", mcmcX, mcmcY, mcmcSize, mcmcSize);

  // DUSP logo with fixed width, preserve aspect ratio
  const fixedWidth = 30;
  const aspectRatio = duspLogoData.height / duspLogoData.width;
  const duspHeight = fixedWidth * aspectRatio;

  // Vertically align DUSP logo with MCMC by centering them on same baseline or middle
  const alignedY = mcmcY + (mcmcSize - duspHeight) / 2;
  const duspX = 165;

  doc.addImage(
    duspLogoData.dataUrl,
    "JPEG",
    duspX,
    alignedY,
    fixedWidth,
    duspHeight
  );

  doc.setFont("VerdanaBd", "bold");
  doc.setFontSize(12);
  doc.text("THE NATIONAL INFORMATION", 105, 25, { align: "center" });
  doc.text("DISSEMINATION CENTRE (NADI)", 105, 30, { align: "center" });
}

export const generateDocketNumber = (
  duspCode: string,
  now: Date,
  id: number
) => {
  /**
   * Docket number generation
   * Format: DUSPYYMMDDXXXX
   *
   * DUSP: dusp code
   * YY: year
   * MM: month
   * DD: day
   * XXXX: from 'id' column in maintenance table (4 digits)
   */

  const idStr = id.toString();
  const last4Digits =
    idStr.length > 4
      ? idStr.slice(-4) // truncate and keep last 4 digits
      : idStr.padStart(4, "0"); // fill with leading zeros

  return duspCode + formatDate(now, "yyMMdd") + last4Digits;
};
