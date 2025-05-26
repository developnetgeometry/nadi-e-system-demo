import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/dashboard/PageHeader";
import { PageContainer } from "@/components/ui/dashboard/PageContainer";
import { Button } from "@/components/ui/button";
import { Link, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area-dashboard";
import RegisterProgrammeForm from "@/components/programmes/RegisterProgrammeForm";
import { supabase } from "@/integrations/supabase/client";

const ProgrammeRegistration = () => {
  const { id } = useParams();
  const location = useLocation();
  const [programme, setProgramme] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const isEditMode = !!id;

  // Get category from the query params if available (for defaulting category based on origin page)
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get("category");

  useEffect(() => {
    const fetchProgramme = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("nd_event")
          .select(
            `
            id,
            program_name,
            description,
            location_event,
            start_datetime,
            end_datetime,
            duration,
            trainer_name,
            category_id,
            subcategory_id,
            program_id,
            module_id,
            program_mode,
            is_group_event,
            total_participant,
            status_id
          `
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        setProgramme(data);
      } catch (error) {
        console.error("Error fetching programme details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramme();
  }, [id]);

  if (loading) {
    return (
      <div>
        <PageContainer className="h-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">
              Loading programme details...
            </p>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div>
      <PageContainer className="h-full overflow-hidden flex flex-col">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link to="/programmes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Programmes
            </Link>
          </Button>
        </div>
        <PageHeader
          title={isEditMode ? "Edit Programme" : "Register New Programme"}
          description={
            isEditMode
              ? "Update programme details"
              : "Create a new programme in the system"
          }
        />
        <ScrollArea className="flex-1 pr-4">
          <RegisterProgrammeForm
            programmeData={programme}
            isEditMode={isEditMode}
            defaultCategoryId={categoryId ? parseInt(categoryId) : undefined}
          />
        </ScrollArea>
      </PageContainer>
    </div>
  );
};

export default ProgrammeRegistration;
