import { format } from "date-fns";
import { AcroFormCheckBox, jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { Button } from "@/components/ui/button";
import "@/fonts/Verdana-normal.js";
import "@/fonts/VerdanaBd-bold.js";

const GenerateMaintenanceReportCM = () => {
  const FONT_SIZE = 8;
  const HEADER_BG_COLOR: [number, number, number] = [220, 220, 220];

  const generatePDF = async () => {
    function footerNadiDocs(doc: jsPDF, date: Date) {
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

    const getBase64Image = async (url: string): Promise<string> => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    };

    const CURRENT_DATE = new Date();

    const [mcmcLogo, imageB] = await Promise.all([
      getBase64Image(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/MCMC_Logo.png/1088px-MCMC_Logo.png"
      ),
      getBase64Image("https://picsum.photos/200?random=2"),
    ]);

    const doc = new jsPDF();

    doc.addImage(mcmcLogo, "JPEG", 15, 10, 30, 30);
    doc.addImage(imageB, "JPEG", 165, 10, 30, 30);

    // Centered Title
    doc.setFont("VerdanaBd", "bold");
    doc.setFontSize(12);
    doc.text("THE NATIONAL INFORMATION", 105, 25, { align: "center" });
    doc.text("DISSEMINATION CENTRE (NADI)", 105, 30, { align: "center" });

    const rows1 = [
      [
        {
          content: "CORRECTIVE MAINTENANCE SHEET",
          colSpan: 4,
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: HEADER_BG_COLOR,
            font: "VerdanaBd",
          },
        },
      ],
      [
        {
          content: "SITE DETAILS",
          colSpan: 4,
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: HEADER_BG_COLOR,
            font: "VerdanaBd",
          },
        },
      ],
      [
        {
          content: "SITE NAME",
          colSpan: 1,
          styles: {
            fontStyle: "bold",
            halign: "left",
            font: "VerdanaBd",
          },
        },
        {
          content: "NADI TAMAN CENGAL EMAS",
          colSpan: 1,
          styles: {
            fontStyle: "normal",
            halign: "left",
            font: "Verdana",
          },
        },
        {
          content: "DOCKET NO",
          colSpan: 1,
          styles: {
            fontStyle: "bold",
            halign: "left",
            font: "VerdanaBd",
          },
        },
        {
          content: "K2C001-0001",
          colSpan: 1,
          styles: {
            fontStyle: "normal",
            halign: "left",
            font: "Verdana",
          },
        },
      ],
      [
        {
          content: "PHASE",
          colSpan: 1,
          styles: {
            fontStyle: "bold",
            halign: "left",
            font: "VerdanaBd",
          },
        },
        {
          content: "PID 37",
          colSpan: 1,
          styles: {
            fontStyle: "normal",
            halign: "left",
            font: "Verdana",
          },
        },
        {
          content: "DOCKET DATE/TIME",
          colSpan: 1,
          styles: {
            fontStyle: "bold",
            halign: "left",
            font: "VerdanaBd",
          },
        },
        {
          content: "1FONT_SIZE/12/2024 10:00:05 AM",
          colSpan: 1,
          styles: {
            fontStyle: "normal",
            halign: "left",
            font: "Verdana",
          },
        },
      ],
      [
        {
          content: "FAULTY CATEGORY",
          styles: {
            fontStyle: "bold",
            halign: "left",
            font: "VerdanaBd",
          },
        },
        {
          content: "CEILING SURFING AREA MELENGKUNG & REPAINT DINDING (MERAH)",
          colSpan: 3,
          styles: {
            fontStyle: "normal",
            halign: "left",
            font: "Verdana",
          },
        },
      ],
      [
        {
          content: "FAULTY DESCRIPTION",
          styles: {
            fontStyle: "bold",
            halign: "left",
            font: "VerdanaBd",
          },
        },
        {
          content: "CEILING SURFING AREA MELENGKUNG & REPAINT DINDING (MERAH)",
          colSpan: 3,
          styles: {
            fontStyle: "normal",
            halign: "left",
            font: "Verdana",
          },
        },
      ],
    ];

    autoTable(doc, {
      startY: 50,
      body: rows1,
      theme: "grid",
      styles: {
        fontSize: FONT_SIZE,
        cellPadding: 2,
        valign: "middle",
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
      },
      margin: { left: 15, right: 15 },
    });

    const rows2 = [
      [
        {
          content: "VENDOR ACTION",
          colSpan: 2,
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: HEADER_BG_COLOR,
            font: "VerdanaBd",
          },
        },
      ],
      [
        {
          content: "ACTION DATE/TIME",
        },
        {
          content: "20/12/2024",
        },
      ],
      [
        {
          content: "ACTUAL FAULT",
        },
        {
          content: "",
        },
      ],
      [
        {
          content: "RESTORATION ACTION",
          styles: {
            minCellHeight: 20,
            valign: "top",
          },
        },
        {
          content: "REPAINT (MERAH) & MENGIKAT SEMULA SYILING YANG MELENGKUNG",
          styles: {
            minCellHeight: 20,
            valign: "top",
          },
        },
      ],
      [
        {
          content: "RESTORATION STATUS",
        },
        {
          content: "",
        },
      ],
      [
        {
          content: "NEW ACTION TAKEN",
        },
        {
          content: "",
        },
      ],
      [
        {
          content: "COMMENT / CONCLUSION",
          styles: {
            minCellHeight: 30,
            valign: "top",
          },
        },
        {
          content: "",
          styles: {
            minCellHeight: 30,
            valign: "top",
          },
        },
      ],
      [
        {
          content: "RECOMMENDATION (IF ANY)",
        },
        {
          content: "",
        },
      ],
    ];

    autoTable(doc, {
      startY: 100, // example Y start, adjust as needed
      body: rows2,
      theme: "grid",
      styles: {
        fontSize: FONT_SIZE,
        cellPadding: 2,
        valign: "middle",
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
      },
      margin: { left: 15, right: 15 },
      columnStyles: {
        0: {
          cellWidth: "auto",
          halign: "left",
          fontStyle: "bold",
          font: "VerdanaBd",
        },
        1: {
          cellWidth: "wrap",
          halign: "left",
          fontStyle: "normal",
          font: "Verdana",
        },
      },
      tableWidth: "auto",
      didDrawCell: (data) => {
        if (data.column.index === 1 && data.row.index === 4) {
          const cellX = data.cell.x;
          const cellY = data.cell.y;
          const cellWidth = data.cell.width;
          const cellHeight = data.cell.height;

          const checkboxSize = 4; // bigger checkbox size for better visibility

          // Checkbox positions (vertically centered)
          const checkboxX1 = cellX + 5;
          const checkboxY = cellY + (cellHeight - checkboxSize) / 2;

          const checkboxX2 = checkboxX1 + checkboxSize + 30; // space between checkboxes

          // Create checkboxes
          const restorationStatus = new AcroFormCheckBox();
          restorationStatus.fieldName = "COMPLETED";
          restorationStatus.value = "On";
          restorationStatus.appearanceState = "On";
          restorationStatus.x = checkboxX1;
          restorationStatus.y = checkboxY;
          restorationStatus.width = checkboxSize;
          restorationStatus.height = checkboxSize;
          restorationStatus.readOnly = true;

          // Draw border around checkbox 1
          doc.setDrawColor(0, 0, 0); // black border
          doc.setLineWidth(0.5);
          doc.rect(checkboxX1, checkboxY, checkboxSize, checkboxSize);

          // Draw border around checkbox 2
          doc.rect(checkboxX2, checkboxY, checkboxSize, checkboxSize);

          const restorationStatus2 = new AcroFormCheckBox();
          restorationStatus2.fieldName = "PENDING";
          restorationStatus2.value = "Off";
          restorationStatus2.appearanceState = "Off";
          restorationStatus2.x = checkboxX2;
          restorationStatus2.y = checkboxY;
          restorationStatus2.width = checkboxSize;
          restorationStatus2.height = checkboxSize;
          restorationStatus2.readOnly = true;

          doc.addField(restorationStatus);
          doc.addField(restorationStatus2);

          // Add labels next to checkboxes
          doc.setFont("Verdana", "normal");
          doc.setFontSize(FONT_SIZE);
          doc.setTextColor(0, 0, 0);
          doc.text(
            "COMPLETED",
            checkboxX1 + checkboxSize + 5,
            checkboxY + checkboxSize - 1
          );
          doc.text(
            "PENDING",
            checkboxX2 + checkboxSize + 5,
            checkboxY + checkboxSize - 1
          );
        }
      },
    });

    // VENDOR and NADI INFORMATION
    const vendorInfoRows = [
      [
        {
          content: "VENDOR INFORMATION",
          colSpan: 2,
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: HEADER_BG_COLOR,
            font: "VerdanaBd",
          },
        },
      ],
      [
        {
          content: "NAME",
        },
        {
          content: "AHMAD BIN ABU",
        },
      ],
      [
        {
          content: "COMPANY",
        },
        {
          content: "MSD DIGITAL INTELLIGENCE SDN BHD",
        },
      ],
      [
        {
          content: "CONTACT NO.",
        },
        {
          content: "012-3456789",
        },
      ],
      [
        {
          content: "DATE",
        },
        {
          content: "01 JAN 2025",
        },
      ],
      [
        {
          content: "SIGN & STAMP",
        },
        {
          content: "",
          styles: {
            minCellHeight: 35,
          },
        },
      ],
    ];

    const nadiInfoRows = [
      [
        {
          content: "NADI INFORMATION",
          colSpan: 2,
          styles: {
            halign: "center",
            fontStyle: "bold",
            fillColor: HEADER_BG_COLOR,
            font: "VerdanaBd",
          },
        },
      ],
      [
        {
          content: "NAME",
        },
        {
          content: "NUR SITI",
        },
      ],
      [
        {
          content: "DESIGNATION",
        },
        {
          content: "MANAGER",
        },
      ],
      [
        {
          content: "CONTACT NO.",
        },
        {
          content: "012-3456789",
        },
      ],
      [
        {
          content: "DATE",
        },
        {
          content: "01 JAN 2025",
        },
      ],
      [
        {
          content: "SIGN & STAMP",
        },
        {
          content: "",
          styles: {
            minCellHeight: 35,
          },
        },
      ],
    ];

    // 1. VENDOR INFORMATION
    autoTable(doc, {
      startY: 200,
      margin: { left: 15 },
      body: vendorInfoRows,
      theme: "grid",
      tableWidth: 87,
      styles: {
        fontSize: FONT_SIZE,
        cellPadding: 2,
        valign: "middle",
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
      },
      columnStyles: {
        0: {
          cellWidth: 30,
          halign: "left",
          fontStyle: "bold",
          font: "VerdanaBd",
          fillColor: HEADER_BG_COLOR,
        },
        1: {
          cellWidth: "wrap",
          halign: "left",
          fontStyle: "normal",
          font: "Verdana",
        },
      },
      didDrawPage: (data) => {
        // 2. NADI INFORMATION
        autoTable(doc, {
          startY: 200,
          margin: { left: 108 },
          body: nadiInfoRows,
          theme: "grid",
          tableWidth: 87,
          styles: {
            fontSize: FONT_SIZE,
            cellPadding: 2,
            valign: "middle",
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.3,
          },
          columnStyles: {
            0: {
              cellWidth: 30,
              halign: "left",
              fontStyle: "bold",
              font: "VerdanaBd",
              fillColor: HEADER_BG_COLOR,
            },
            1: {
              cellWidth: "wrap",
              halign: "left",
              fontStyle: "normal",
              font: "Verdana",
            },
          },
        });
      },
    });

    footerNadiDocs(doc, CURRENT_DATE);

    doc.save("all-in-one-table.pdf");
  };

  return (
    <Button type="button" className="w-full" onClick={generatePDF}>
      Generate Report
    </Button>
  );
};

export default GenerateMaintenanceReportCM;
