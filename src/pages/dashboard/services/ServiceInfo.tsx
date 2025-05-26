import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { useServiceData } from "@/hooks/use-service-data";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error/ErrorFallback";

/**
 * ServiceInfo page component that displays available services and membership plans
 */
const ServiceInfo = () => {
  const { data: services, isLoading, error } = useServiceData();

  console.log("ServiceInfo rendering with:", { services, isLoading, error });

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <ErrorMessage message="Failed to load service information" />
      </div>
    );
  }

  return (
    <div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="space-y-1">
          <div>
            <h1 className="text-xl font-bold">Service Information</h1>
            <p className="text-muted-foreground mt-2">
              View available services and membership plans
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {services?.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      {service.description}
                    </p>
                    <p className="text-xl font-bold text-primary">
                      {service.price}
                    </p>
                    <div>
                      <h4 className="font-medium mb-2">Features:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="text-muted-foreground">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default ServiceInfo;
