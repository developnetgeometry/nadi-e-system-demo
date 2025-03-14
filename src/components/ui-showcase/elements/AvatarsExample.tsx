
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export const AvatarsExample = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Avatars</h3>
      <div className="flex flex-wrap gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        
        <Avatar>
          <AvatarFallback className="bg-indigo-100 text-indigo-600">JD</AvatarFallback>
        </Avatar>
        
        <Avatar>
          <AvatarFallback className="bg-green-100 text-green-600">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex -space-x-2">
          <Avatar className="border-2 border-background">
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback>B</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export const avatarsCode = `<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

<Avatar>
  <AvatarFallback className="bg-indigo-100 text-indigo-600">JD</AvatarFallback>
</Avatar>

<div className="flex -space-x-2">
  <Avatar className="border-2 border-background">
    <AvatarFallback>A</AvatarFallback>
  </Avatar>
  <Avatar className="border-2 border-background">
    <AvatarFallback>B</AvatarFallback>
  </Avatar>
</div>`;
