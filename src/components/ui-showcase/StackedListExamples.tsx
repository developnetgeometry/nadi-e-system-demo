import React from "react";
import { Check, Clock, MoreVertical, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const StackedListExamples = () => {
  return (
    <div className="grid gap-6">
      {/* Notification List */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <ul className="divide-y">
            <li className="flex items-center p-4">
              <div className="flex-shrink-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg" alt="Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium">John Doe commented on your post</div>
                <div className="text-sm text-muted-foreground">5 minutes ago</div>
              </div>
              <div className="flex-shrink-0">
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </li>
            <li className="flex items-center p-4">
              <div className="flex-shrink-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg" alt="Avatar" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium">Jane Smith mentioned you</div>
                <div className="text-sm text-muted-foreground">1 hour ago</div>
              </div>
              <div className="flex-shrink-0">
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <ul className="divide-y">
            <li className="flex items-center p-4">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium line-through text-muted-foreground">
                    Complete project proposal
                  </div>
                  <Badge>Completed</Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Due 3 days ago</div>
              </div>
            </li>
            <li className="flex items-center p-4">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Prepare presentation slides</div>
                  <Badge variant="outline">In Progress</Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Due tomorrow</div>
              </div>
            </li>
            <li className="flex items-center p-4">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Review client feedback</div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Due in 2 days</div>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export const stackedListCode = `{/* Notification List */}
<Card>
  <CardHeader>
    <CardTitle>Notifications</CardTitle>
  </CardHeader>
  <CardContent className="px-0">
    <ul className="divide-y">
      <li className="flex items-center p-4">
        <div className="flex-shrink-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg" alt="Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm font-medium">John Doe commented on your post</div>
          <div className="text-sm text-muted-foreground">5 minutes ago</div>
        </div>
        <div className="flex-shrink-0">
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </li>
      <li className="flex items-center p-4">
        <div className="flex-shrink-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg" alt="Avatar" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm font-medium">Jane Smith mentioned you</div>
          <div className="text-sm text-muted-foreground">1 hour ago</div>
        </div>
        <div className="flex-shrink-0">
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </li>
    </ul>
  </CardContent>
</Card>

{/* Task List */}
<Card>
  <CardHeader>
    <CardTitle>Tasks</CardTitle>
  </CardHeader>
  <CardContent className="px-0">
    <ul className="divide-y">
      <li className="flex items-center p-4">
        <div className="flex-shrink-0">
          <Check className="h-5 w-5 text-green-500" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium line-through text-muted-foreground">
              Complete project proposal
            </div>
            <Badge>Completed</Badge>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Due 3 days ago</div>
        </div>
      </li>
      <li className="flex items-center p-4">
        <div className="flex-shrink-0">
          <Clock className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Prepare presentation slides</div>
            <Badge variant="outline">In Progress</Badge>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Due tomorrow</div>
        </div>
      </li>
      <li className="flex items-center p-4">
        <div className="flex-shrink-0">
          <X className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Review client feedback</div>
            <Badge variant="secondary">Pending</Badge>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Due in 2 days</div>
        </div>
      </li>
    </ul>
  </CardContent>
</Card>`;
