// useChartImageGenerator.ts
import { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

interface ChartImageGeneratorOptions {
  onImageReady: (base64Image: string) => void;
  delay?: number;
}

export const useChartImageGenerator = ({ onImageReady, delay = 500 }: ChartImageGeneratorOptions) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!chartRef.current) return;

      html2canvas(chartRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff"
      }).then((canvas) => {
        const base64Image = canvas.toDataURL("image/png");
        onImageReady(base64Image);
      });
    }, delay); // Allow time for render

    return () => clearTimeout(timer);
  }, [onImageReady, delay]);

  return chartRef;
};
