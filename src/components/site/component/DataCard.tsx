
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DataCardProps {
  title: string;
  value: string | number;
  description?: string;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  name?: string;
  label?: React.ReactNode
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  children?: React.ReactNode;
}

export const DataCard = ({
  title,
  value,
  description,
  name,
  label,
  footer,
  icon,
  className,
  trend,
  children,
}: DataCardProps) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        {!!label ? 
          (
            <>
              <div className='flex items-center justify-center gap-3'>
                {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
                <CardTitle className="text-lg font-medium">{title}</CardTitle>
              </div>
              <span>{label}</span>
            </>
          ) :
          (
            <>
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
            </>
          )
        }
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <CardDescription className="text-xs text-muted-foreground mt-1">
            {description}
          </CardDescription>
        )}
        {name && (
          <CardDescription className='font-semibold text-lg text-black'>
            {name}
          </CardDescription> 
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span 
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-green-500" : "text-red-500"
              )}
            >
              {trend.positive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">{trend.label}</span>
          </div>
        )}
        {children}
      </CardContent>
      {footer && <CardFooter className="pt-1">{footer}</CardFooter>}
    </Card>
  );
};

export default DataCard;
