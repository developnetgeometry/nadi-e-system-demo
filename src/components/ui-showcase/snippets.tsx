
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
import { HeadingsExamples, headingsCode } from "./HeadingsExamples";
import { DescriptionListExamples, descriptionListCode } from "./DescriptionListExamples";
import { StatsExamples, statsCode } from "./StatsExamples";
import { DatePickerExamples, datePickerCode } from "./DatePickerExamples";
import { StackedListExamples, stackedListCode } from "./StackedListExamples";
import { TableExamples, tableCode } from "./TableExamples";
import { GridListExamples, gridListCode } from "./GridListExamples";
import { FeedExamples, feedCode } from "./FeedExamples";
import { FeedbackAlertsExamples, feedbackAlertsCode } from "./FeedbackAlertsExamples";
import { NavigationExamples, navigationCode } from "./NavigationExamples";
import { ProgressExamples, progressCode } from "./ProgressExamples";
import { CommandPaletteExamples, commandPaletteCode } from "./CommandPaletteExamples";
import { ElementsExamples, elementsCode } from "./ElementsExamples";
import { LayoutExamples, layoutCode } from "./LayoutExamples";
import { OverlaysExamples, overlaysCode } from "./OverlaysExamples";
import { PaginatedSelectExamples, paginatedSelectCode } from "./PaginatedSelectExamples";

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
    title: "Elements (Avatars, Badges, Dropdowns, Button Groups)",
    description: "Essential UI elements for user interaction and display",
    component: <ElementsExamples />,
    code: elementsCode,
  },
  {
    title: "Layout (Containers, Cards, Lists, Media Objects, Dividers)",
    description: "Building blocks for page structure and content organization",
    component: <LayoutExamples />,
    code: layoutCode,
  },
  {
    title: "Overlays (Modals, Notifications)",
    description: "Dialog windows, notifications and other overlaying components",
    component: <OverlaysExamples />,
    code: overlaysCode,
  },
  {
    title: "Paginated Select Dropdown",
    description: "Dropdown select with pagination for large datasets",
    component: <PaginatedSelectExamples />,
    code: paginatedSelectCode,
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
  {
    title: "Headings",
    description: "Page headings, section headings, and card headings",
    component: <HeadingsExamples />,
    code: headingsCode,
  },
  {
    title: "Description Lists",
    description: "Various ways to display key-value data",
    component: <DescriptionListExamples />,
    code: descriptionListCode,
  },
  {
    title: "Stats",
    description: "Numerical data displays with trends and indicators",
    component: <StatsExamples />,
    code: statsCode,
  },
  {
    title: "Calendar & Schedule",
    description: "Date picker and calendar with scheduling components",
    component: <DatePickerExamples />,
    code: datePickerCode,
  },
  {
    title: "Stacked Lists",
    description: "Vertically stacked content lists for notifications and tasks",
    component: <StackedListExamples />,
    code: stackedListCode,
  },
  {
    title: "Tables",
    description: "Data tables with various features and styling options",
    component: <TableExamples />,
    code: tableCode,
  },
  {
    title: "Grid Lists",
    description: "Card grids for displaying collections of content",
    component: <GridListExamples />,
    code: gridListCode,
  },
  {
    title: "Feeds",
    description: "Social media style content feeds and activity streams",
    component: <FeedExamples />,
    code: feedCode,
  },
  {
    title: "Feedback & Alerts",
    description: "Alert messages, notifications, and empty states",
    component: <FeedbackAlertsExamples />,
    code: feedbackAlertsCode,
  },
  {
    title: "Navigation",
    description: "Breadcrumbs, tabs, and pagination components",
    component: <NavigationExamples />,
    code: navigationCode,
  },
  {
    title: "Progress Indicators",
    description: "Progress bars and loading indicators",
    component: <ProgressExamples />,
    code: progressCode,
  },
  {
    title: "Command Palette",
    description: "Command menus for quick navigation and actions",
    component: <CommandPaletteExamples />,
    code: commandPaletteCode,
  },
];
