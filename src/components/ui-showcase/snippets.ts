
import { ReactNode } from "react";
import { ButtonExamples, buttonCode } from "./ButtonExamples";
import { InputExamples, inputCode } from "./InputExamples";
import { SelectExamples, selectCode } from "./SelectExamples";
import { TextareaExamples, textareaCode } from "./TextareaExamples";
import { CheckboxExamples, checkboxCode } from "./CheckboxExamples";
import { SwitchExamples, switchCode } from "./SwitchExamples";
import { FormExamples, formCode } from "./FormExamples";
import { CardExamples, cardCode } from "./CardExamples";
import { InputGroupExamples, inputGroupCode } from "./InputGroupExamples";

export type CodeSnippet = {
  title: string;
  component: ReactNode;
  code: string;
  description: string;
};

export const codeSnippets: CodeSnippet[] = [
  {
    title: "Button",
    description: "Various button styles for different actions",
    component: <ButtonExamples />,
    code: buttonCode,
  },
  {
    title: "Input",
    description: "Text input fields for user data entry",
    component: <InputExamples />,
    code: inputCode,
  },
  {
    title: "Select",
    description: "Dropdown selection menus for choosing options",
    component: <SelectExamples />,
    code: selectCode,
  },
  {
    title: "Textarea",
    description: "Multi-line text input for longer content",
    component: <TextareaExamples />,
    code: textareaCode,
  },
  {
    title: "Checkbox",
    description: "Checkboxes for multiple selections and toggles",
    component: <CheckboxExamples />,
    code: checkboxCode,
  },
  {
    title: "Switch",
    description: "Toggle switches for binary options",
    component: <SwitchExamples />,
    code: switchCode,
  },
  {
    title: "Form with Validation",
    description: "Complete form with validation using React Hook Form and Zod",
    component: <FormExamples />,
    code: formCode,
  },
  {
    title: "Card",
    description: "Card components for content organization",
    component: <CardExamples />,
    code: cardCode,
  },
  {
    title: "Input Groups",
    description: "Grouped input fields for related information",
    component: <InputGroupExamples />,
    code: inputGroupCode,
  },
];
