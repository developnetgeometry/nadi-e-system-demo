
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const GridListExamples = () => {
  const projects = [
    { 
      id: 1, 
      title: "Website Redesign", 
      description: "Redesigning the company website with new branding", 
      status: "In Progress", 
      members: ["JD", "AS", "RK"],
      completion: 65
    },
    { 
      id: 2, 
      title: "Mobile App Development", 
      description: "Creating a new mobile application for customers", 
      status: "Planning", 
      members: ["PL", "AS"],
      completion: 20
    },
    { 
      id: 3, 
      title: "Marketing Campaign", 
      description: "Q4 marketing campaign for product launch", 
      status: "Completed", 
      members: ["JD", "RK", "MN"],
      completion: 100
    },
    { 
      id: 4, 
      title: "API Integration", 
      description: "Integrating payment gateway API", 
      status: "In Progress", 
      members: ["RK"],
      completion: 45
    },
  ];

  return (
    <div className="grid gap-4">
      {/* Simple Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <Badge
                  variant={
                    project.status === "Completed" 
                      ? "success" 
                      : project.status === "In Progress" 
                        ? "default" 
                        : "secondary"
                  }
                >
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{project.description}</p>
              <div className="mt-4 w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${project.completion}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {project.completion}% complete
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex -space-x-2">
                {project.members.map((member, i) => (
                  <Avatar key={i} className="border-2 border-background h-8 w-8">
                    <AvatarFallback className="text-xs">{member}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const gridListCode = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {projects.map((project) => (
    <Card key={project.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{project.title}</CardTitle>
          <Badge variant="success">{project.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{project.description}</p>
        <div className="mt-4 w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full" 
            style={{ width: \`\${project.completion}%\` }}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex -space-x-2">
          {project.members.map((member, i) => (
            <Avatar key={i} className="border-2 border-background h-8 w-8">
              <AvatarFallback className="text-xs">{member}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </CardFooter>
    </Card>
  ))}
</div>`;
