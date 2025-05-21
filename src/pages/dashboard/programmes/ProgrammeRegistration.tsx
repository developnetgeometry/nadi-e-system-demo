import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/dashboard/PageHeader";
import { PageContainer } from "@/components/ui/dashboard/PageContainer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import RegisterProgrammeForm from "@/components/programmes/RegisterProgrammeForm";

const ProgrammeRegistration = () => {
  return (
    <DashboardLayout>
      <PageContainer>
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link to="/programmes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Programmes
            </Link>
          </Button>
        </div>
        <PageHeader
          title="Register New Programme"
          description="Create a new programme in the system"
        />
        <RegisterProgrammeForm />
      </PageContainer>
    </DashboardLayout>
  );
};

export default ProgrammeRegistration;
