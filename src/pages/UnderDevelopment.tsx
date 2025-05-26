import { AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const UnderDevelopment = () => (
  <div>
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-background p-8 text-center">
      <Container>
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4 mx-auto" />
        <h1 className="text-4xl font-bold mb-2">Page Under Development</h1>
        <p className="mb-4 text-muted-foreground">
          This page is currently under development. Please check back soon!
        </p>
      </Container>
    </div>
  </div>
);

export default UnderDevelopment;
