
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CodeSnippetProps {
  title: string;
  description: string;
  component: React.ReactNode;
  code: string;
  index: number;
}

export const CodeSnippet = ({
  title,
  description,
  component,
  code,
  index,
}: CodeSnippetProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" /> Copy Code
              </>
            )}
          </Button>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="border-t border-b p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center">
          {component}
        </div>
      </CardContent>
      <CardContent className="p-6 pt-4">
        <pre className="overflow-x-auto rounded-lg bg-black p-4 text-sm text-white">
          <code>{code}</code>
        </pre>
      </CardContent>
    </Card>
  );
};
