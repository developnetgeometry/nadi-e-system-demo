import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPdf = <T extends { [key: string]: any }>(
  { data, title }: { data: T[]; title: string }
) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Add date
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  // Create table
  const header = Object.keys(data[0]);
  const rows = data.map((row) => Object.values(row));

  autoTable(doc, {
    head: [header],
    body: rows,
    startY: 35,
    theme: "grid",
    headStyles: {
      fillColor: [0, 128, 0],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
  });

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, "_")}.pdf`);
};

