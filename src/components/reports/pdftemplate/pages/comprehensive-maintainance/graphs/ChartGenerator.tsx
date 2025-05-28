// ChartGenerator.tsx
import { useState, useEffect, useMemo } from 'react';
import { DocketStatusChart } from './charts/DocketStatusChart';
import { MaintenanceData } from '@/hooks/report/use-cm-byphase-pdf-data';

// Define chart bundle type
export interface ChartBundle {
  docketStatusChart: string;
}

interface ChartGeneratorProps {
  maintainanceData: MaintenanceData[];
  onChartsReady: (charts: ChartBundle) => void;
}

const ChartGenerator: React.FC<ChartGeneratorProps> = ({
  maintainanceData,
  onChartsReady
}) => {
  const [charts, setCharts] = useState<Partial<ChartBundle>>({});

  // Handle individual chart ready events
  const handleChartReady = (type: keyof ChartBundle, base64Image: string) => {
    setCharts(prevCharts => ({
      ...prevCharts,
      [type]: base64Image
    }));
  };

  useEffect(() => {
    // When all charts are ready, notify parent component
    if (charts.docketStatusChart) {
      onChartsReady(charts as ChartBundle);
    }
  }, [charts, onChartsReady]);  // Transform and aggregate the maintenance data by status and SLA type
  const transformedData = useMemo(() => {
    // Log the incoming data for debugging
    console.log('Raw maintenance data:', maintainanceData);
    
    // Create a mapping of status to counts of minor and major
    const statusMap: Record<string, { minor: number; major: number }> = {};

    maintainanceData.forEach(item => {
      // Make sure status exists, default to "Unknown" if not
      const status = item.status || "Unknown";
      
      // Initialize the status in the map if it doesn't exist
      if (!statusMap[status]) {
        statusMap[status] = { minor: 0, major: 0 };
      }
      
      // Increment the appropriate counter based on SLA
      if (item.SLA?.toLowerCase() === 'minor') {
        statusMap[status].minor += 1;
      } else if (item.SLA?.toLowerCase() === 'major') {
        statusMap[status].major += 1;
      }
    });

    // Convert the map to an array of objects for the chart
    const result = Object.entries(statusMap).map(([status, counts]) => ({
      status,
      minor: counts.minor,
      major: counts.major
    }));
    
    // Log the transformed data for debugging
    console.log('Transformed chart data:', result);
    return result;
  }, [maintainanceData]);

  // Render the chart component with the transformed data
  return (
    <>
      <DocketStatusChart
        data={transformedData}
        width={650}
        height={400}
        onReady={(img) => handleChartReady('docketStatusChart', img)}
      />
    </>
  );
};

export default ChartGenerator;
