// ChartImageRenderer.tsx
import { useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";

type Props = {
  data: any[];
  onReady: (img: string) => void;
};

export const ChartImageRenderer = ({ data, onReady }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!chartRef.current) return;
      html2canvas(chartRef.current).then((canvas) => {
        const base64Image = canvas.toDataURL("image/png");
        onReady(base64Image);
      });
    }, 500); // Allow time for render

    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div
      ref={chartRef}
      style={{ width: 500, height: 300, position: "absolute", left: "-9999px" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="state" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
