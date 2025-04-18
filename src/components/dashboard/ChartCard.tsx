
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  detailsPath?: string; // Path to redirect to for more details
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, detailsPath }) => {
  return (
    <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-300">{title}</CardTitle>
        {detailsPath && (
          <Link to={detailsPath}>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-sm text-primary hover:text-primary/80">
              More <ArrowRight size={16} />
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="h-[250px] w-full">
          <React.Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          }>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </React.Suspense>
        </div>
      </CardContent>
    </Card>
  );
};

// Simple error boundary to catch errors in chart rendering
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Error in chart component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <AlertCircle className="w-10 h-10 mb-2" />
          <p>Unable to load chart data</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChartCard;
