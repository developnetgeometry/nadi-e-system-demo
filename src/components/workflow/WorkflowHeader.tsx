
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface WorkflowHeaderProps {
  onCreateWorkflow: () => void;
  activeTab: string;
}

export const WorkflowHeader = ({ onCreateWorkflow, activeTab }: WorkflowHeaderProps) => {
  const getTitle = () => {
    switch (activeTab) {
      case "builder":
        return "Workflow Builder";
      case "analytics":
        return "Workflow Analytics";
      default:
        return "Workflow Management";
    }
  };

  const getDescription = () => {
    switch (activeTab) {
      case "builder":
        return "Design and configure your workflow processes";
      case "analytics":
        return "View insights and performance metrics for your workflows";
      default:
        return "View, manage and monitor all your workflow processes";
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{getTitle()}</h1>
        <p className="text-muted-foreground mt-1">{getDescription()}</p>
      </div>
      {activeTab === "workflows" && (
        <Button 
          onClick={onCreateWorkflow}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      )}
    </div>
  );
};
