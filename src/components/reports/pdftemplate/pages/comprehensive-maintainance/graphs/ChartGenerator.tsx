// ChartGenerator.tsx
import { useState, useEffect } from 'react';
import { DocketStatusChart} from './charts/DocketStatusChart';
import { DocketStatusData } from '@/hooks/report/use-cm-byphase-pdf-data';

// Define chart bundle type
export interface ChartBundle {
  docketStatusChart: string;
}

interface ChartGeneratorProps {
  docketStatusData: DocketStatusData[];
  onChartsReady: (charts: ChartBundle) => void;
}

const ChartGenerator: React.FC<ChartGeneratorProps> = ({
  docketStatusData,
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
  }, [charts, onChartsReady]);

  // Render the chart component
  return (
    <>
      <DocketStatusChart
        data={docketStatusData}
        width={650}
        height={400}
        onReady={(img) => handleChartReady('docketStatusChart', img)}
      />
    </>
  );
};

export default ChartGenerator;
