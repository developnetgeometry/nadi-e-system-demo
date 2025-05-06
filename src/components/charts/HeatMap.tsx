
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HeatMapProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
    // Optional extra data for tooltip
    [key: string]: any;
  }>;
  maxValue?: number;
  minValue?: number;
  colorRange?: [string, string];
  className?: string;
}

export const HeatMap: React.FC<HeatMapProps> = ({
  title,
  data,
  maxValue = Math.max(...data.map(d => d.value)),
  minValue = Math.min(...data.map(d => d.value)),
  colorRange = ['#f3e8ff', '#5F26B4'],
  className,
}) => {
  const getColor = (value: number) => {
    // Normalize the value between 0 and 1
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    
    // Parse the hex colors
    const startColor = {
      r: parseInt(colorRange[0].slice(1, 3), 16),
      g: parseInt(colorRange[0].slice(3, 5), 16),
      b: parseInt(colorRange[0].slice(5, 7), 16)
    };
    
    const endColor = {
      r: parseInt(colorRange[1].slice(1, 3), 16),
      g: parseInt(colorRange[1].slice(3, 5), 16),
      b: parseInt(colorRange[1].slice(5, 7), 16)
    };
    
    // Interpolate between the colors
    const r = Math.round(startColor.r + normalizedValue * (endColor.r - startColor.r));
    const g = Math.round(startColor.g + normalizedValue * (endColor.g - startColor.g));
    const b = Math.round(startColor.b + normalizedValue * (endColor.b - startColor.b));
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const [tooltipData, setTooltipData] = React.useState<null | {
    name: string;
    value: number;
    x: number;
    y: number;
  }>(null);

  const handleMouseEnter = (item: any, e: React.MouseEvent) => {
    setTooltipData({
      name: item.name,
      value: item.value,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  React.useEffect(() => {
    if (tooltipRef.current && tooltipData) {
      const tooltip = tooltipRef.current;
      tooltip.style.left = `${tooltipData.x + 10}px`;
      tooltip.style.top = `${tooltipData.y + 10}px`;
    }
  }, [tooltipData]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-3 rounded-md transition-transform hover:scale-105"
              style={{ backgroundColor: getColor(item.value) }}
              onMouseEnter={(e) => handleMouseEnter(item, e)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="font-medium text-sm text-foreground">{item.name}</div>
              <div className="text-xs mt-1 text-foreground/80">{item.value}</div>
            </div>
          ))}
        </div>
        
        {tooltipData && (
          <div 
            ref={tooltipRef}
            className={cn(
              "absolute z-50 bg-white p-2 rounded-md shadow-md text-sm",
              "border border-border"
            )}
            style={{ 
              position: 'fixed',
              pointerEvents: 'none',
            }}
          >
            <div className="font-medium">{tooltipData.name}</div>
            <div>Value: {tooltipData.value}</div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-xs text-muted-foreground">Low</div>
          <div 
            className="h-2 flex-1 mx-2 rounded-full"
            style={{
              background: `linear-gradient(to right, ${colorRange[0]}, ${colorRange[1]})`
            }}
          />
          <div className="text-xs text-muted-foreground">High</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatMap;
