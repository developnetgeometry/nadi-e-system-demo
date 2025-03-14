
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ScrollAreaExample = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Scroll Area</h3>
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="p-2 rounded-md bg-muted">
              Scrollable content item {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export const scrollAreaCode = `<ScrollArea className="h-[200px] w-full rounded-md border p-4">
  <div className="space-y-4">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="p-2 rounded-md bg-muted">
        Scrollable content item {i + 1}
      </div>
    ))}
  </div>
</ScrollArea>`;
