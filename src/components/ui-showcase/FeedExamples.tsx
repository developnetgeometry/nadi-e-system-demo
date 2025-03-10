
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FeedExamples = () => {
  return (
    <div className="grid gap-6">
      {/* Social Media Feed */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Post Header */}
          <div className="flex items-center p-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className="text-sm font-semibold">John Doe</div>
              <div className="text-xs text-muted-foreground">Posted 2 hours ago</div>
            </div>
          </div>
          
          {/* Post Content */}
          <div className="px-4 py-2">
            <p className="text-sm">
              Just launched my new portfolio website! Check it out and let me know what you think 🚀
            </p>
          </div>
          
          {/* Post Media */}
          <div className="bg-muted aspect-video w-full">
            <img 
              src="/placeholder.svg" 
              alt="Post image"
              className="h-full w-full object-cover" 
            />
          </div>
          
          {/* Post Stats */}
          <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
            <span>24 likes</span>
            <span>8 comments</span>
          </div>
          
          <Separator />
          
          {/* Post Actions */}
          <div className="flex p-2">
            <Button variant="ghost" className="flex-1">
              <Heart className="mr-2 h-4 w-4" />
              Like
            </Button>
            <Button variant="ghost" className="flex-1">
              <MessageSquare className="mr-2 h-4 w-4" />
              Comment
            </Button>
            <Button variant="ghost" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 font-medium">Recent Activity</div>
          <Separator />
          <div className="px-4 py-3">
            <div className="flex items-start space-x-4">
              <div className="relative mt-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Jane Smith</div>
                  <div className="text-xs text-muted-foreground">1h ago</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Completed the quarterly report and shared it with the team
                </p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="px-4 py-3">
            <div className="flex items-start space-x-4">
              <div className="relative mt-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>RJ</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Robert Johnson</div>
                  <div className="text-xs text-muted-foreground">2h ago</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Created a new project and assigned team members
                </p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="px-4 py-3">
            <div className="flex items-start space-x-4">
              <div className="relative mt-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>AL</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Amy Lee</div>
                  <div className="text-xs text-muted-foreground">3h ago</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Commented on the design proposal
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const feedCode = `{/* Social Media Feed Post */}
<Card className="overflow-hidden">
  <CardContent className="p-0">
    {/* Post Header */}
    <div className="flex items-center p-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src="/placeholder.svg" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div className="ml-3">
        <div className="text-sm font-semibold">John Doe</div>
        <div className="text-xs text-muted-foreground">Posted 2 hours ago</div>
      </div>
    </div>
    
    {/* Post Content */}
    <div className="px-4 py-2">
      <p className="text-sm">
        Just launched my new portfolio website! Check it out 🚀
      </p>
    </div>
    
    {/* Post Media */}
    <div className="bg-muted aspect-video w-full">
      <img 
        src="/placeholder.svg" 
        alt="Post image"
        className="h-full w-full object-cover" 
      />
    </div>
    
    {/* Post Actions */}
    <div className="flex p-2">
      <Button variant="ghost" className="flex-1">
        <Heart className="mr-2 h-4 w-4" />
        Like
      </Button>
      <Button variant="ghost" className="flex-1">
        <MessageSquare className="mr-2 h-4 w-4" />
        Comment
      </Button>
      <Button variant="ghost" className="flex-1">
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    </div>
  </CardContent>
</Card>

{/* Activity Feed Item */}
<div className="px-4 py-3">
  <div className="flex items-start space-x-4">
    <Avatar className="h-6 w-6">
      <AvatarImage src="/placeholder.svg" alt="User" />
      <AvatarFallback>JS</AvatarFallback>
    </Avatar>
    <div className="flex-1 space-y-1">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Jane Smith</div>
        <div className="text-xs text-muted-foreground">1h ago</div>
      </div>
      <p className="text-sm text-muted-foreground">
        Completed the quarterly report
      </p>
    </div>
  </div>
</div>`;

