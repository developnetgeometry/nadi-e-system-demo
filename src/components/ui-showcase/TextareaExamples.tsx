
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const TextareaExamples = () => {
  return (
    <div className="grid w-full gap-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Type your message here."
          className="min-h-[100px]"
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="disabled-textarea">Disabled</Label>
        <Textarea
          id="disabled-textarea"
          placeholder="Disabled textarea"
          disabled
        />
      </div>
    </div>
  );
};

export const textareaCode = `<div className="grid w-full items-center gap-1.5">
  <Label htmlFor="message">Message</Label>
  <Textarea
    id="message"
    placeholder="Type your message here."
    className="min-h-[100px]"
  />
</div>`;
