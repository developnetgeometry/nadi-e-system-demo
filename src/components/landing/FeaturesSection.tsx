import { BarChart3, Calendar, Shield, Users } from "lucide-react";

const features = [
  {
    title: "HR Management",
    description: "Streamline your HR processes and employee management",
    icon: Users,
  },
  {
    title: "Asset Management",
    description: "Track and manage your assets effectively",
    icon: Shield,
  },
  {
    title: "Financial Management",
    description: "Handle finances and transactions with ease",
    icon: BarChart3,
  },
  {
    title: "Programme Management",
    description: "Organize and track your programmes efficiently",
    icon: Calendar,
  },
];

export const FeaturesSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Comprehensive Management Solutions
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Everything you need to manage your organization efficiently
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="pt-6">
                <div className="flow-root rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};