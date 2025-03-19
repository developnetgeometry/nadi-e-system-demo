
import { Organization } from "@/types/organization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Building, Info, Users } from "lucide-react";
import { OrganizationUserList } from "../OrganizationUserList";

interface OrganizationInfoProps {
  organization: Organization;
}

export function OrganizationInfo({ organization }: OrganizationInfoProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        {organization.logo_url ? (
          <div className="h-20 w-20 rounded-md overflow-hidden bg-muted p-1">
            <AspectRatio ratio={1} className="w-full h-full">
              <img
                src={organization.logo_url}
                alt={organization.name}
                className="object-contain w-full h-full"
              />
            </AspectRatio>
          </div>
        ) : (
          <div className="h-20 w-20 rounded-md bg-muted flex items-center justify-center">
            <Building className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        <div>
          <CardTitle className="text-xl">{organization.name}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">Type:</span>
            <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-0.5 rounded uppercase">{organization.type}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details" className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1">{organization.description || "No description provided."}</p>
            </div>
            
            {organization.parent_id && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Parent Organization</h3>
                <p className="mt-1">
                  ID: {organization.parent_id}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                <p className="mt-1">
                  {new Date(organization.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                <p className="mt-1">
                  {new Date(organization.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="users">
            <OrganizationUserList />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
