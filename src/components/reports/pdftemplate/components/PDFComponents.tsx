import React from "react";
import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// PDF styles for the components
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  logo: { 
    width: 80, 
    height: 60 
  },
  titleSection: { 
    textAlign: "center", 
    flex: 1 
  },
  title: { 
    fontSize: 14, 
    fontWeight: "bold", 
    textTransform: "uppercase" 
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
  },
  footerLine: {
    height: 1,
    backgroundColor: "#aaa",
    opacity: 0.3,
    marginBottom: 4,
  },
  footerText: { 
    fontSize: 9, 
    color: "#666" 
  },
  row: {
    flexDirection: "row",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  cellLabel: {
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: "bold",
    padding: 6,
    borderRightWidth: 1,
    width: "25%",
  },
  cellValue: {
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#000",
    width: "25%",
  },
});

/**
 * The PDF header component with MCMC and DUSP logos
 */
export const PDFHeader = ({ 
  mcmcLogo, 
  duspLogo 
}: { 
  mcmcLogo: string, 
  duspLogo: string 
}) => (
  <View style={styles.header}>
    <Image src={mcmcLogo} style={styles.logo} />
    <View style={styles.titleSection}>
      <Text style={styles.title}>THE NATIONAL INFORMATION</Text>
      <Text style={styles.title}>DISSEMINATION CENTRE (NADI)</Text>
    </View>
    <Image src={duspLogo} style={styles.logo} />
  </View>
);

/**
 * The PDF meta section component for report information
 */
export const PDFMetaSection = ({
  reportTitle,
  phaseLabel,
  periodType = "MONTH / YEAR",
  periodValue,
}: {
  reportTitle: string;
  phaseLabel?: string;
  periodType?: string;
  periodValue?: string;
}) => (
  <>
    <View style={styles.row}>
      <Text style={[styles.cellLabel, { width: "25%" }]}>REPORT</Text>
      <Text style={[styles.cellValue, { width: "75%" }]}>{reportTitle}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.cellLabel}>PHASE</Text>
      <Text style={styles.cellValue}>{phaseLabel || "-"}</Text>
      <Text style={styles.cellLabel}>{periodType}</Text>
      <Text style={styles.cellValue}>{periodValue || "-"}</Text>
    </View>
  </>
);

/**
 * The PDF Section Title component
 */
export const PDFSectionTitle = ({ 
  title 
}: { 
  title: string 
}) => {
  const sectionStyles = StyleSheet.create({
    sectionTitle: {
      backgroundColor: "#000",
      color: "#fff",
      padding: 8,
      fontSize: 12,
      fontWeight: "bold",
      marginTop: 20,
      marginBottom: 10,
      textTransform: "uppercase",
    }
  });

  return <Text style={sectionStyles.sectionTitle}>{title}</Text>;
};

// PDFBox removed as it's specific to individual reports and not reusable

/**
 * The PDF Table component for standardized tables
 */
export const PDFTable = <T extends Record<string, any>>({
  data,
  columns,
}: {
  data: T[];
  columns: {
    key: keyof T | ((row: T, index: number) => React.ReactNode);
    header: string;
    width?: number | string;
    render?: (value: any, row: T, index: number) => React.ReactNode;
  }[];
}) => {  const tableStyles = StyleSheet.create({
    table: { 
      width: "100%", 
      border: "1pt solid #000", 
      marginTop: 10 
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#000",
      color: "#fff",
      fontWeight: "bold",
    },
    tableRow: { 
      flexDirection: "row", 
      borderBottom: "1pt solid #000" 
    },
    th: { 
      padding: 8, 
      flex: 1, 
      fontSize: 10,
      fontWeight: "bold",
      textTransform: "uppercase",
      textAlign: "center",
      borderRight: "1pt solid #fff",
    },    td: { 
      padding: 8, 
      paddingLeft: 12,
      flex: 1, 
      fontSize: 10,
      borderRight: "1pt solid #000",
    },
  });

  return (
    <View style={tableStyles.table}>
      <View style={tableStyles.tableHeader}>
        {columns.map((column, i) => (
          <Text 
            key={i} 
            style={[
              tableStyles.th,
              column.width ? { flex: undefined, width: column.width } : {}
            ]}
          >
            {column.header}
          </Text>
        ))}
      </View>      {data.map((row, rowIndex) => (
        <View 
          key={rowIndex} 
          style={[
            tableStyles.tableRow,
            // Add white background to even rows (makes alternating rows)
            rowIndex % 2 === 1 ? { backgroundColor: "#f9f9f9" } : {}
          ]}
        >
          {columns.map((column, colIndex) => {
            const cellValue = typeof column.key === 'function' 
              ? column.key(row, rowIndex)
              : row[column.key as keyof T];

            const displayValue = column.render 
              ? column.render(cellValue, row, rowIndex) 
              : cellValue;

            return (
              <Text 
                key={colIndex} 
                style={[
                  tableStyles.td,
                  column.width ? { flex: undefined, width: column.width } : {},
                  // Center the content in the first column (No column)
                  colIndex === 0 ? { textAlign: 'center' } : {}
                ]}
              >
                {displayValue}
              </Text>
            );
          })}
        </View>
      ))}
    </View>
  );
};

/**
 * The PDF footer component
 */
export const PDFFooter = ({ 
  customText 
}: { 
  customText?: string 
}) => (
  <View style={styles.footer}>
    <View style={styles.footerLine} />
    <Text style={styles.footerText}>
      {customText || "This document is system-generated from e-System."}
    </Text>
  </View>
);
