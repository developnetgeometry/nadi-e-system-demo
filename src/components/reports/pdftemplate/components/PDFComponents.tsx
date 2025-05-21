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
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  cellLabel: {
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: "bold",
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#000",
    width: "25%",
  },
  cellValue: {
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#000",
    width: "25%",
  },  
  appendixTitlePage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    position: "relative",
  },  appendixContent: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    textAlign: "center",
  },  appendixPhaseInfo: {
    position: "absolute",
    top: 60, /* Positioned lower on the page */
    right: 0,
    zIndex: 100,
  },
  appendixNumber: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    textTransform: "uppercase",
  },  appendixTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },  phaseQuarterInfo: {
    textAlign: "right",
    fontSize: 8,
    marginLeft: "auto", /* Push to the right side */
    marginTop: 15, /* Position below other elements instead of at the top */
    zIndex: 100,
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
}) => {  
  // Create styles for the meta section table
  const metaStyles = StyleSheet.create({
    container: {
      width: "100%",
      borderWidth: 1,
      borderColor: "#000",
      marginBottom: 10,
    },
    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
    },
    firstRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
    },    
    labelCell: {
      backgroundColor: "#000",
      color: "#fff",
      fontWeight: "bold",
      padding: 6,
      width: "20%",
      borderRightWidth: 1,
      borderRightColor: "#000",
    },    
    valueCell: {
      padding: 6,
      width: "80%",
      borderRightWidth: 0,
    },
    phaseCell: {
      padding: 6,
      width: "30%", 
      borderRightWidth: 1,
      borderRightColor: "#000",
    },
    periodLabelCell: {
      backgroundColor: "#000",
      color: "#fff", 
      fontWeight: "bold",
      padding: 6,
      width: "25%",
      borderRightWidth: 1,
      borderRightColor: "#000",
    },    
    periodValueCell: {
      padding: 6,
      width: "25%",
      borderRightWidth: 0, // Remove right border on the last cell
    }
  });
  
  // Create a style for the last row that doesn't have a bottom border
  const lastRowStyle = {
    ...metaStyles.row,
    borderBottomWidth: 0, // Remove bottom border from last row to avoid double borders
  };
  
  return (
    <View style={metaStyles.container}>
      <View style={metaStyles.firstRow}>
        <Text style={metaStyles.labelCell}>REPORT</Text>
        <Text style={metaStyles.valueCell}>{reportTitle}</Text>
      </View>
      <View style={lastRowStyle}>
        <Text style={metaStyles.labelCell}>PHASE</Text>
        <Text style={metaStyles.phaseCell}>{phaseLabel || "-"}</Text>
        <Text style={metaStyles.periodLabelCell}>{periodType}</Text>
        <Text style={metaStyles.periodValueCell}>{periodValue || "-"}</Text>
      </View>
    </View>
  );
};

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
}) => {
  // Process columns to handle dynamic and fixed width columns
  const fixedWidthColumns = columns.filter(col => col.width);
  const dynamicColumns = columns.filter(col => !col.width);
  
  // Calculate total fixed width percentage  
  const totalFixedWidth = fixedWidthColumns.reduce((total, col) => {
    const width = typeof col.width === 'string' 
      ? parseFloat(col.width.replace('%', '')) 
      : (typeof col.width === 'number' ? col.width : 0);
    return total + width;
  }, 0);
  
  // Calculate remaining percentage for dynamic columns
  const remainingWidth = Math.max(0, 100 - totalFixedWidth);
  const dynamicColumnWidth = dynamicColumns.length > 0 
    ? remainingWidth / dynamicColumns.length 
    : 0;  
  const tableStyles = StyleSheet.create({
    table: { 
      width: "100%", 
      borderWidth: 1,
      borderColor: "#000",
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
      borderBottomWidth: 1,
      borderBottomColor: "#000"
    },
    th: { 
      padding: 8, 
      fontSize: 10,
      fontWeight: "bold",
      textTransform: "uppercase",
      textAlign: "center",
      color: "#fff",
    },      td: { 
      padding: 8,
      fontSize: 10,
    },
    cell: {
      borderRightWidth: 1,
      borderRightStyle: "solid",
      borderRightColor: "#000",
    },
    numberCell: {
      width: "5%",
      textAlign: "center",
      paddingLeft: 4,
      paddingRight: 4,
    }
  });  
  
  // Verify that the total of all widths adds up to 100%
  // If explicit widths are provided for all columns, we'll use them directly
  let totalSpecifiedWidth = 0;
  let allColumnsHaveWidth = true;
  
  columns.forEach(column => {
    if (column.width) {
      // Extract numeric value from percentage (e.g., "30%" -> 30)
      const widthValue = typeof column.width === 'string' 
        ? parseFloat(column.width.replace('%', '')) 
        : (typeof column.width === 'number' ? column.width : 0);
      
      totalSpecifiedWidth += widthValue;
    } else {
      allColumnsHaveWidth = false;
    }
  });
  
  // Create styles for each column once - this ensures header and data cells use exactly the same width
  const columnStyles = columns.map((column, index) => {
    // Base style with border
    const style: any = { 
      borderRightWidth: 1,
      borderRightColor: "#000" 
    };
    
    // Set width based on column specifications
    if (column.width) {
      // Use specified width directly
      style.width = column.width;
    } else if (allColumnsHaveWidth && totalSpecifiedWidth !== 100) {
      // Adjust for case where all widths are specified but don't add to 100%
      const correction = 100 / totalSpecifiedWidth;
      const columnWidth = parseFloat(columns[index].width?.toString() || "0");
      style.width = `${columnWidth * correction}%`;
    } else if (index === 0) {
      // Default width for number column if not specified
      style.width = "5%";
    } else {
      // Equal distribution for remaining columns
      style.width = `${dynamicColumnWidth}%`;
    }
    
    // Special handling for number column
    if (index === 0) {
      style.textAlign = "center";
      style.paddingLeft = 4;
      style.paddingRight = 4;
    }
    
    // Remove right border from the last column to prevent double borders with table border
    if (index === columns.length - 1) {
      style.borderRightWidth = 0;
    }
    
    return style;
  });  
  
  return (
    <View style={tableStyles.table}>
      <View style={tableStyles.tableHeader}>
        {columns.map((column, i) => (          
          <Text 
            key={i} 
            style={[
              tableStyles.th,
              columnStyles[i]
            ]}
          >
            {column.header}
          </Text>
        ))}
      </View>
      
      {data.map((row, rowIndex) => (
        <View 
          key={rowIndex} 
          style={[
            tableStyles.tableRow,
            // Add white background to even rows and remove bottom border from last row
            {
              ...(rowIndex % 2 === 1 && { backgroundColor: "#f9f9f9" }),
              ...(rowIndex === data.length - 1 && { borderBottomWidth: 0 })
            }
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
                  columnStyles[colIndex]
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
 * Component for displaying Phase and Quarter information aligned with the totalBox component
 */
export const PDFPhaseQuarterInfo = ({
  phaseLabel,
  periodType = "MONTH / YEAR",
  periodValue,
}: {
  phaseLabel?: string;
  periodType?: string;
  periodValue?: string;
}) => (
  <View style={{
    ...styles.phaseQuarterInfo, 
    width: 170, 
  }}>
    <Text style={{ fontSize: 8, textTransform: "uppercase" }}>
      <Text style={{ fontWeight: "bold" }}>PHASE: </Text>
      {phaseLabel || '-'}
    </Text>
    <Text style={{ fontSize: 8, textTransform: "uppercase" }}>
      <Text style={{ fontWeight: "bold" }}>{periodType}: </Text>
      {periodValue || '-'}
    </Text>
  </View>
);

/**
 * The PDF Appendix Title Page component
 */
export const PDFAppendixTitlePage = ({ 
  appendixNumber,
  title,
}: { 
  appendixNumber: string;
  title: string;
  phaseLabel?: string;
  periodType?: string;
  periodValue?: string;
  showPhaseInfo?: boolean;
}) => {
  return (
    <View style={{flex: 1, position: "relative"}}>
      <View style={styles.appendixContent}>
        <Text style={styles.appendixNumber}>{appendixNumber}</Text>
        <Text style={styles.appendixTitle}>{title}</Text>
      </View>
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
