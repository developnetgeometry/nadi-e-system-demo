import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ServiceInfo = () => {
  const services = [
    {
      id: 1,
      name: "Basic Membership",
      description: "Access to basic facilities and services",
      price: "RM 50/month",
      features: ["Gym access", "Basic classes", "Locker usage"],
    },
    {
      id: 2,
      name: "Premium Membership",
      description: "Full access to all facilities and premium services",
      price: "RM 100/month",
      features: ["All basic features", "Premium classes", "Personal trainer", "Spa access"],
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Service Information</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">{service.description}</p>
                <p className="text-xl font-bold">{service.price}</p>
                <div>
                  <h4 className="font-medium mb-2">Features:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceInfo;