import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PostList } from "@/components/community/PostList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const CommunityDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Community</h1>
            <p className="text-muted-foreground mt-2">
              Engage with other members through posts and discussions
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
        <PostList />
      </div>
    </DashboardLayout>
  );
};

export default CommunityDashboard;