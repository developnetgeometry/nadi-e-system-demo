import React from "react";
import { Text, View, StyleSheet, Image, Link } from "@react-pdf/renderer";
import { Svg, Rect, Path } from "@react-pdf/renderer";

// PDF styles for the components
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  logo: {
    height: "auto",
    width: 80 // Maintain aspect ratio
  },
  logo2: {
    height: "auto",
    width: 90 // Maintain aspect ratio
  },
  titleSection: {
    textAlign: "center",
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center",     // Center horizontally
    flexDirection: "column",  // Ensure children stack vertically
  },
  title: {
    textAlign: "center",
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
    marginBottom: 10,
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
  }, appendixContent: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    textAlign: "center",
  }, appendixPhaseInfo: {
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
  }, appendixTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  }, phaseQuarterInfo: {
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
  mcmcLogo?: string,
  duspLogo?: string
}) => (
  <View style={[styles.header]}> 
    <View style={{ width: "25%", justifyContent: "center", alignItems: "center", padding: 2 }}>
      {mcmcLogo && <Image src={mcmcLogo} style={styles.logo} />}
    </View>
    <View style={[styles.titleSection, {padding: 2 }]}> 
      <Text style={styles.title}>THE NATIONAL INFORMATION</Text>
      <Text style={styles.title}>DISSEMINATION CENTRE (NADI)</Text>
    </View>
    <View style={{ width: "25%", justifyContent: "center", alignItems: "center", padding: 2 }}>
      {duspLogo && <Image src={duspLogo} style={styles.logo2} />}
    </View>
  </View>
);

/**
 * The PDF meta section component for report information
 */
export const PDFMetaSection = ({
  reportTitle,
  phaseLabel,
  claimType = null,
  quater = null,
  startDate = null,
  endDate = null,
}: {
  reportTitle: string;
  phaseLabel?: string;
  claimType?: string | null;
  quater?: string | number | null;
  startDate?: string | null;
  endDate?: string | null;
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

  // Determine periodType based on claimType if not directly provided
  const periodType = claimType ?
    (claimType.toLowerCase() === "monthly" ? "MONTH / YEAR" :
      claimType.toLowerCase() === "quarterly" ? "QUARTER / YEAR" :
        claimType.toLowerCase() === "yearly" ? "YEAR" :
          "All Time") : "All Time";


  // Format the period value based on periodType and available data
  let formattedPeriodValue = "-";

  // Extract month and year from startDate and endDate if provided
  const month = startDate ? new Date(startDate).toLocaleString('default', { month: 'short' }) : null;
  const year = endDate ? new Date(endDate).getFullYear().toString() : null;

  if (periodType === "MONTH / YEAR" && month && year) {
    formattedPeriodValue = `${month} ${year}`;
  } else if (periodType === "QUARTER / YEAR") {
    if (quater && year) {
      formattedPeriodValue = `${quater} ${year}`;
    }
  } else if (periodType === "YEAR" && year) {
    formattedPeriodValue = `${year}`;
  }

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
        <Text style={metaStyles.periodValueCell}>{formattedPeriodValue}</Text>
      </View>
    </View>
  );
};

/**
 * The PDF meta section component for site-specific reports with different layout
 */
export const PDFMetaSection2 = ({
  title,
  claimType = null,
  quater = null,
  startDate = null,
  endDate = null,
  phaseLabel,
  nadiName,
  refId,
  siteCode,
  state,
}: {
  title?: string;
  claimType?: string | null;
  quater?: string | number | null;
  startDate?: string | null;
  endDate?: string | null;
  phaseLabel?: string;
  nadiName?: string;
  refId?: string;
  siteCode?: string;
  state?: string;
}) => {
  // Format duration from startDate and endDate
  const formatDuration = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Format start date as "1 OCT"
      const startDay = start.getDate();
      const startMonth = start.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
      
      // Format end date as "31 DEC 2024"
      const endDay = end.getDate();
      const endMonth = end.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
      const endYear = end.getFullYear();
      
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`;
    }
    return "-";
  };

  // Determine periodType based on claimType if not directly provided
  const periodType = claimType ?
    (claimType.toLowerCase() === "monthly" ? "MONTH / YEAR" :
      claimType.toLowerCase() === "quarterly" ? "QUARTER / YEAR" :
        claimType.toLowerCase() === "yearly" ? "YEAR" :
          "All Time") : "All Time";

  // Format the period value based on periodType and available data
  let formattedPeriodValue = "-";

  // Extract month and year from startDate and endDate if provided
  const month = startDate ? new Date(startDate).toLocaleString('default', { month: 'short' }) : null;
  const year = endDate ? new Date(endDate).getFullYear().toString() : null;

  if (periodType === "MONTH / YEAR" && month && year) {
    formattedPeriodValue = `${month} ${year}`;
  } else if (periodType === "QUARTER / YEAR") {
    if (quater && year) {
      formattedPeriodValue = `${quater} ${year}`;
    }
  } else if (periodType === "YEAR" && year) {
    formattedPeriodValue = `${year}`;
  }
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
    lastRow: {
      flexDirection: "row",
      borderBottomWidth: 0, // No bottom border for last row
    },
    labelCell: {
      backgroundColor: "#fff",
      color: "#000",
      fontWeight: "bold",
      padding: 6,
      borderRightWidth: 1,
      borderRightColor: "#000",
      textAlign: "center",
      justifyContent: "center", // Center text vertically in the cell
      alignItems: "center",
      overflow: "hidden", // Prevent text overflow
    },
    valueCell: {
      padding: 6,
      borderRightWidth: 1,
      borderRightColor: "#000",
      textAlign: "center", // Center align for colon columns
      justifyContent: "center", // Center vertically
      alignItems: "center", // Center horizontally
    },
    lastValueCell: {
      padding: 6,
      borderRightWidth: 0, // No right border for last cell
      textAlign: "left",
      justifyContent: "center", // Center text vertically in the cell
      alignItems: "flex-start",
    },
    titleContainer: {
      backgroundColor: "#000",
      padding: 6,
      width: "100%",
      textAlign: "center",
    },
    titleText: {
      color: "#fff",
      fontSize: 10,
      fontWeight: "bold",
      textTransform: "uppercase",
    }
  });

  // Define table structure - single source of truth for layout
  // Column widths optimized to ensure "QUARTER/YEAR" label fits on a single line
  const tableStructure = {
    totalColumns: 6,
    columnTypes: ['leftLabel', 'colon', 'leftValue', 'rightLabel', 'colon', 'rightValue'],
    baseWidths: {
      leftLabel: 22,     // Left label columns (DURATION, NADI NAME, REFID, PHASE) - reduced from 24% to 22%
      colon: 4,          // Colon separators (:) - both left and right use same width
      leftValue: 26,     // Left value columns (reduced to give more space to right value)
      rightLabel: 24,    // Right label columns (QUARTER/YEAR, SITE CODE, STATE)
      rightValue: 18     // Right value columns (increased to 18% to prevent wrapping of long state names)
    }
  };

  // Calculate precise column widths accounting for border space
  const calculateColumnWidths = () => {
    const { totalColumns, baseWidths } = tableStructure;
    
    // PDF measurements in points (react-pdf standard)
    const estimatedContainerWidth = 500;
    const borderWidth = 1;
    const totalBorderWidth = (totalColumns + 1) * borderWidth;
    const availableWidth = estimatedContainerWidth - totalBorderWidth;
    
    // Calculate actual widths in points
    const leftLabelWidthPt = (baseWidths.leftLabel / 100) * availableWidth;
    const colonWidthPt = (baseWidths.colon / 100) * availableWidth;
    const leftValueWidthPt = (baseWidths.leftValue / 100) * availableWidth;
    const rightLabelWidthPt = (baseWidths.rightLabel / 100) * availableWidth;
    const rightValueWidthPt = (baseWidths.rightValue / 100) * availableWidth;
    
    // Convert to percentage strings for react-pdf
    const toPercentage = (widthPt) => `${((widthPt / estimatedContainerWidth) * 100).toFixed(2)}%`;
    
    return {
      leftLabel: toPercentage(leftLabelWidthPt),
      colon: toPercentage(colonWidthPt),
      leftValue: toPercentage(leftValueWidthPt),
      rightLabel: toPercentage(rightLabelWidthPt),
      rightValue: toPercentage(rightValueWidthPt),
      nadiNameSpan: toPercentage(availableWidth - leftLabelWidthPt - colonWidthPt)
    };
  };

  const columnWidths = calculateColumnWidths();

  return (
    <View style={metaStyles.container}>
      {/* Title Header (if title is provided) */}
      {title && (
        <View style={metaStyles.titleContainer}>
          <Text style={metaStyles.titleText}>{title}</Text>
        </View>
      )}

      {/* Row 1: DURATION and QUARTER/YEAR */}
      <View style={metaStyles.row}>
        <View style={[metaStyles.labelCell, { width: columnWidths.leftLabel }]}>
          <Text>DURATION</Text>
        </View>
        <View style={[metaStyles.valueCell, { width: columnWidths.colon }]}>
          <Text style={{ textAlign: "center" }}>:</Text>
        </View>
        <View style={[metaStyles.lastValueCell, { width: columnWidths.leftValue, textAlign: "left", justifyContent: "center", alignItems: "flex-start", borderRightWidth: 1, borderRightColor: "#000" }]}>
          <Text>{formatDuration()}</Text>
        </View>
        <View style={[metaStyles.labelCell, { width: columnWidths.rightLabel }]}>
          <Text>{periodType}</Text>
        </View>
        <View style={[metaStyles.valueCell, { width: columnWidths.colon }]}>
          <Text style={{ textAlign: "center" }}>:</Text>
        </View>
        <View style={[metaStyles.lastValueCell, { width: columnWidths.rightValue }]}>
          <Text>{formattedPeriodValue}</Text>
        </View>
      </View>

      {/* Row 2: NADI NAME (spans remaining columns) */}
      <View style={metaStyles.row}>
        <View style={[metaStyles.labelCell, { width: columnWidths.leftLabel }]}>
          <Text>NADI NAME</Text>
        </View>
        <View style={[metaStyles.valueCell, { width: columnWidths.colon }]}>
          <Text style={{ textAlign: "center" }}>:</Text>
        </View>
        <View style={[metaStyles.lastValueCell, { width: columnWidths.nadiNameSpan, textAlign: "left", justifyContent: "center", alignItems: "flex-start" }]}>
          <Text>{nadiName || "-"}</Text>
        </View>
      </View>

      {/* Row 3: REFID and SITE CODE */}
      <View style={metaStyles.row}>
        <View style={[metaStyles.labelCell, { width: columnWidths.leftLabel }]}>
          <Text>REFID</Text>
        </View>
        <View style={[metaStyles.valueCell, { width: columnWidths.colon }]}>
          <Text style={{ textAlign: "center" }}>:</Text>
        </View>
        <View style={[metaStyles.lastValueCell, { width: columnWidths.leftValue, textAlign: "left", justifyContent: "center", alignItems: "flex-start", borderRightWidth: 1, borderRightColor: "#000" }]}>
          <Text>{refId || "-"}</Text>
        </View>
        <View style={[metaStyles.labelCell, { width: columnWidths.rightLabel }]}>
          <Text>SITE CODE</Text>
        </View>
        <View style={[metaStyles.valueCell, { width: columnWidths.colon }]}>
          <Text style={{ textAlign: "center" }}>:</Text>
        </View>
        <View style={[metaStyles.lastValueCell, { width: columnWidths.rightValue }]}>
          <Text>{siteCode || "-"}</Text>
        </View>
      </View>

      {/* Row 4: PHASE and STATE (last row, no bottom border) */}
      <View style={metaStyles.lastRow}>
        <View style={[metaStyles.labelCell, { width: columnWidths.leftLabel }]}>
          <Text>PHASE</Text>
        </View>
        <View style={[metaStyles.valueCell, { width: columnWidths.colon }]}>
          <Text style={{ textAlign: "center" }}>:</Text>
        </View>
        <View style={[metaStyles.lastValueCell, { width: columnWidths.leftValue, textAlign: "left", justifyContent: "center", alignItems: "flex-start", borderRightWidth: 1, borderRightColor: "#000" }]}>
          <Text>{phaseLabel || "-"}</Text>
        </View>
        <View style={[metaStyles.labelCell, { width: columnWidths.rightLabel }]}>
          <Text>STATE</Text>
        </View>
        <View style={[metaStyles.valueCell, { width: columnWidths.colon }]}>
          <Text style={{ textAlign: "center" }}>:</Text>
        </View>
        <View style={[metaStyles.lastValueCell, { width: columnWidths.rightValue }]}>
          <Text>{state || "-"}</Text>
        </View>
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
      fontSize: 10,
      fontWeight: "bold",
      marginTop: 20,
      marginBottom: 10,
      textTransform: "uppercase",
    }
  });

  return <Text style={sectionStyles.sectionTitle}>{title}</Text>;
};

/**
 * The PDF Info Table component for displaying structured information tables with title header
 */
export const PDFInfoTable = ({
  title,
  data,
}: {
  title: string;
  data: { label: string; value: string }[];
}) => {
  const infoTableStyles = StyleSheet.create({
    container: {
      width: "85%", // Reduced width to add margin on both sides
      borderWidth: 1,
      borderColor: "#000",
      marginBottom: 20,
      marginHorizontal: "auto", // Center the table
    },
    titleContainer: {
      backgroundColor: "#000",
      padding: 6, // Slightly reduced padding
      width: "100%",
      textAlign: "center",
    },
    title: {
      color: "#fff",
      fontSize: 9, // Reduced font size
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
    },
    labelCell: {
      backgroundColor: "#fff",
      padding: 5, // Slightly reduced padding
      width: "30%",
      borderRightWidth: 1,
      borderRightColor: "#000",
      fontSize: 8, // Reduced font size
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    valueCell: {
      padding: 5, // Slightly reduced padding
      width: "70%",
      fontSize: 8, // Reduced font size
    }
  });

  return (
    <View style={infoTableStyles.container}>
      <View style={infoTableStyles.titleContainer}>
        <Text style={infoTableStyles.title}>{title}</Text>
      </View>
      {data.map((item, index) => (
        <View
          key={index}
          style={[
            infoTableStyles.row,
            // Remove bottom border from last row
            index === data.length - 1 && { borderBottomWidth: 0 }
          ]}
        >
          <Text style={infoTableStyles.labelCell}>{item.label}</Text>
          <Text style={infoTableStyles.valueCell}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

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
    align?: 'left' | 'center' | 'right'; // <-- allow per-column alignment
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
  let remainingWidth = Math.max(0, 100 - totalFixedWidth);
  let dynamicColumnWidth = dynamicColumns.length > 0
    ? remainingWidth / dynamicColumns.length
    : 0;

  // If no columns have width, distribute equally
  if (fixedWidthColumns.length === 0) {
    dynamicColumnWidth = 100 / columns.length;
    remainingWidth = 100;
  }

  const tableStyles = StyleSheet.create({
    table: {
      width: "100%",
      // Remove borderWidth and borderColor to avoid hanging borders
      // borderWidth: 1,
      // borderColor: "#000",
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
      padding: 6,
      fontSize: 8,
      fontWeight: "bold",
      textTransform: "uppercase",
      textAlign: "center",
      color: "#fff",
    },
    td: {
      padding: 6,
      fontSize: 8,
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

  // Create styles for each column once - this ensures header and data cells use exactly the same width
  const columnStyles = columns.map((column, index) => {
    // Base style with border
    const style: any = {
      borderRightWidth: 1,
      borderRightColor: "#000"
    };
    // Set width based on column specifications
    if (column.width) {
      style.width = column.width;
    } else {
      style.width = `${dynamicColumnWidth}%`;
    }
    // Remove special textAlign and padding for first column, let alignment be handled by align property
    // If you want first column always center, set align: 'center' in the column definition
    return style;
  });

  return (
    <View style={tableStyles.table}>
      <View style={tableStyles.tableHeader} fixed>
        {columns.map((column, i) => (
          <Text
            key={i}
            style={[
              tableStyles.th,
              columnStyles[i],
              i === 0 && { borderLeftWidth: 1, borderLeftColor: "#000" },
              i === columns.length - 1 && { borderRightWidth: 1, borderRightColor: "#000" }
            ]}
          >
            {column.header}
          </Text>
        ))}
      </View>
      {data.map((row, rowIndex) => (
        <View
          key={rowIndex}
          wrap={false}
          style={[
            tableStyles.tableRow,
            rowIndex % 2 === 1 && { backgroundColor: "#f9f9f9" }
          ]}
        >
          {columns.map((column, colIndex) => {
            const cellValue = typeof column.key === 'function'
              ? column.key(row, rowIndex)
              : row[column.key as keyof T];
            const displayValue = column.render
              ? column.render(cellValue, row, rowIndex)
              : cellValue;
            // Dynamic alignment: first column center by default, others left unless align is set
            const align = column.align || (colIndex === 0 ? 'center' : 'left');
            const alignItems = align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start');
            return (
              <View
                key={colIndex}
                style={[
                  columnStyles[colIndex],
                  colIndex === 0 && { borderLeftWidth: 1, borderLeftColor: "#000" },
                  colIndex === columns.length - 1 && { borderRightWidth: 1, borderRightColor: "#000" },
                  { justifyContent: "center", alignItems, minHeight: 18 }
                ]}
              >
                {typeof displayValue === 'string' || typeof displayValue === 'number' ? (
                  <Text style={[tableStyles.td, align !== 'left' && { textAlign: align }]}>{displayValue}</Text>
                ) : (
                  <View style={{ 
                    width: '100%', 
                    justifyContent: 'center', 
                    alignItems, 
                    paddingHorizontal: 6,
                    paddingVertical: 6 
                  }}>
                    {React.isValidElement(displayValue) && displayValue.type === Link ? 
                      React.cloneElement(displayValue as React.ReactElement<any>, {
                        style: {
                          fontSize: 8,
                          color: '#0066cc',
                          textDecoration: 'none',
                          flexWrap: 'wrap',
                          textAlign: align,
                          width: '100%',
                          ...((displayValue.props as any)?.style || {})
                        }
                      }) : displayValue
                    }
                  </View>
                )}
              </View>
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
  claimType = null,
  quater = null,
  startDate = null,
  endDate = null,
}: {
  phaseLabel?: string;
  claimType?: string | null;
  quater?: string | number | null;
  startDate?: string | null;
  endDate?: string | null;
}) => {
  // Determine periodType based on claimType
  const periodType = claimType ?
    (claimType.toLowerCase() === "monthly" ? "MONTH / YEAR" :
      claimType.toLowerCase() === "quarterly" ? "QUARTER / YEAR" :
        claimType.toLowerCase() === "yearly" ? "YEAR" :
          "All Time") : "All Time";
  // Format the period value based on periodType
  let periodValue = '-';

  // Extract month and year from startDate and endDate
  const month = startDate ? new Date(startDate).toLocaleString('default', { month: 'short' }) : null;
  const year = endDate ? new Date(endDate).getFullYear().toString() : null;

  if (periodType === "MONTH / YEAR" && month && year) {
    periodValue = `${month} ${year}`;
  } else if (periodType === "QUARTER / YEAR" && quater && year) {
    periodValue = `${quater} ${year}`;
  } else if (periodType === "YEAR" && year) {
    periodValue = `${year}`;
  }

  return (
    <View style={{
      ...styles.phaseQuarterInfo,
      // width: 170, 
    }}>
      <Text style={{ fontSize: 8, textTransform: "uppercase" }}>
        <Text style={{ fontWeight: "bold" }}>PHASE: </Text>
        {phaseLabel || '-'}
      </Text>
      <Text style={{ fontSize: 8, textTransform: "uppercase" }}>
        <Text style={{ fontWeight: "bold" }}>{periodType}: </Text>
        {periodValue}
      </Text>
    </View>
  );
};

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
    <View style={{ flex: 1, position: "relative" }}>
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
}) => {
  // Get current date and time
  const now = new Date();
  const formattedDateTime = now.toLocaleString('en-MY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <View style={styles.footer} fixed>
      <View style={styles.footerLine} />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.footerText}>
          {"This document is system-generated from NADI e-System."}
        </Text>
        <Text style={styles.footerText}>
          Generated on: {formattedDateTime}
        </Text>
      </View>
    </View>
  );
};

/**
 * PDFCheckbox component for use in PDF tables and forms
 */
export const PDFCheckbox = ({ checked }: { checked: boolean }) => (
  <Svg width={12} height={12} style={{ width: 12, height: 12, margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }} viewBox="0 0 12 12">
    <Rect x={0.5} y={0.5} width={11} height={11} rx={1.5} stroke="#888" strokeWidth={1} fill="#fff" />
    {checked && (
      <Path d="M3 6.5 L5 9 L9 4" stroke="#111" strokeWidth={1.3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </Svg>
);
