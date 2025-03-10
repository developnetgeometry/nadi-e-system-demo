
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CodeSnippet } from "@/components/ui-showcase/CodeSnippet";
import { codeSnippets } from "@/components/ui-showcase/snippets";

const UIComponents = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
            </Button>
          </div>
          <h1 className="text-4xl font-bold">UI Components Showcase</h1>
          <p className="text-muted-foreground">
            A collection of reusable UI components for quick reference and usage
          </p>
        </div>

        <div className="grid gap-8">
          {codeSnippets.map((snippet, index) => (
            <CodeSnippet
              key={index}
              title={snippet.title}
              description={snippet.description}
              component={snippet.component}
              code={snippet.code}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UIComponents;
