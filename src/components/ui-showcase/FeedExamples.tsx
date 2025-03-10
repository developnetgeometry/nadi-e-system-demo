
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, MessageSquare, Share, MoreHorizontal } from "lucide-react";

export const FeedExamples = () => {
  const feedItems = [
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "",
        initials: "AJ",
        role: "Product Manager"
      },
      content: "Just released our new feature! Check it out and let me know what you think.",
      timeAgo: "10 minutes ago",
      likes: 24,
      comments: 5,
      image: ""
    },
    {
      id: 2,
      user: {
        name: "Sarah Williams",
        avatar: "",
        initials: "SW",
        role: "UX Designer"
      },
      content: "I've been working on redesigning our dashboard interface. Here's a sneak peek at what's coming!",
      timeAgo: "2 hours ago",
      likes: 42,
      comments: 11,
      image: ""
    },
    {
      id: 3,
      user: {
        name: "Mike Taylor",
        avatar: "",
        initials: "MT",
        role: "Developer"
      },
      content: "Just fixed a major bug that was causing performance issues. The app should be running much smoother now!",
      timeAgo: "1 day ago",
      likes: 18,
      comments: 3,
      image: ""
    }
  ];

  return (
    <div className="space-y-4">
      {feedItems.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex space-x-4">
                <Avatar>
                  {item.user.avatar ? (
                    <AvatarImage src={item.user.avatar} alt={item.user.name} />
                  ) : null}
                  <AvatarFallback>{item.user.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{item.user.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{item.user.role}</span>
                    <span>•</span>
                    <span>{item.timeAgo}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4">
              <p className="text-sm">{item.content}</p>
              {item.image && (
                <div className="mt-3 rounded-md overflow-hidden">
                  <img 
                    src={item.image} 
                    alt="Post attachment" 
                    className="w-full h-auto" 
                  />
                </div>
              )}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <ThumbsUp className="h-4 w-4 mr-2" />
                {item.likes}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <MessageSquare className="h-4 w-4 mr-2" />
                {item.comments}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const feedCode = `<Card>
  <CardContent className="p-4">
    <div className="flex justify-between items-start">
      <div className="flex space-x-4">
        <Avatar>
          <AvatarFallback>AJ</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold">Alex Johnson</div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>Product Manager</span>
            <span>•</span>
            <span>10 minutes ago</span>
          </div>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
    <div className="mt-4">
      <p className="text-sm">Just released our new feature! Check it out and let me know what you think.</p>
    </div>
    <Separator className="my-4" />
    <div className="flex justify-between">
      <Button variant="ghost" size="sm" className="text-muted-foreground">
        <ThumbsUp className="h-4 w-4 mr-2" />
        24
      </Button>
      <Button variant="ghost" size="sm" className="text-muted-foreground">
        <MessageSquare className="h-4 w-4 mr-2" />
        5
      </Button>
      <Button variant="ghost" size="sm" className="text-muted-foreground">
        <Share className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  </CardContent>
</Card>`;
