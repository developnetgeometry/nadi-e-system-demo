import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, ArrowRight } from "lucide-react";

/**
 * Demo component showing the new navigation flow for site management
 * This can be used to test or demonstrate the new page-based form approach
 */
export const SiteFormNavigationDemo = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Form Navigation Demo</h1>
        <p className="text-muted-foreground">
          Test the new page-based site form navigation
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Create New Site Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-green-600" />
              <span>Create New Site</span>
            </CardTitle>
            <CardDescription>
              Navigate to the site creation page with a full-page form experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/site-management/create")}
              className="w-full flex items-center justify-center space-x-2"
            >
              <span>Go to Create Site Page</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Edit Existing Site Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-blue-600" />
              <span>Edit Existing Site</span>
            </CardTitle>
            <CardDescription>
              Navigate to the site edit page (using demo site ID)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline"
              onClick={() => navigate("/site-management/edit/1")}
              className="w-full flex items-center justify-center space-x-2"
            >
              <span>Go to Edit Site Page (ID: 1)</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Flow Demonstration */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation Flow</CardTitle>
          <CardDescription>
            How the new page-based navigation works
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">Creating a Site:</h4>
              <p className="text-sm text-muted-foreground">
                Site Management → Add New Site → Create Page → Save → Back to Site Management
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">Editing a Site:</h4>
              <p className="text-sm text-muted-foreground">
                Site Management → Edit Icon → Edit Page → Save → Back to Site Management
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium">Benefits:</h4>
              <p className="text-sm text-muted-foreground">
                Full screen space, better mobile experience, cleaner navigation, improved accessibility
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Back to Site Management */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => navigate("/site-management")}
          className="flex items-center space-x-2"
        >
          <span>Back to Site Management</span>
        </Button>
      </div>
    </div>
  );
};

export default SiteFormNavigationDemo;
