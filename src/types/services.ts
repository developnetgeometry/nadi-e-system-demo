export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
}

export interface ServiceCardProps {
  service: Service;
}