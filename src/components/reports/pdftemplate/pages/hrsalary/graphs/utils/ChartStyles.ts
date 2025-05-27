// ChartStyles.ts
export const ChartContainerStyle = {
  backgroundColor: "white",
  padding: "10px",
  boxSizing: "border-box" as const,
  border: "1px solid #ccc",
  borderRadius: "4px"
};

export const ChartTitleStyle = {
  fontSize: 14, 
  fontWeight: 'bold' as const,
  textAnchor: 'middle' as const
};

export const BarChartConfig = {
  margin: { top: 30, right: 30, left: 50, bottom: 40 },
  barSize: 60,
  domain: [0, 'dataMax + 1000'] as const,
  tickCount: 6,
  labelConfig: {
    position: 'top' as const,
    fontSize: 12,
    fontWeight: 'bold' as const,
    fill: '#000',
    dy: -10
  }
};

export const PieChartConfig = {
  margin: { top: 15, right: 10, left: 10, bottom: 10 },
  legendConfig: {
    layout: 'horizontal' as const,
    verticalAlign: 'bottom' as const,
    align: 'center' as const,
    iconSize: 12,
    iconType: 'circle' as const
  }
};
