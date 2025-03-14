
import { buttonCode, ButtonExamples } from "./ButtonExamples";
import { cardCode, CardExamples } from "./CardExamples";
import { checkboxCode, CheckboxExamples } from "./CheckboxExamples";
import { commandPaletteCode, CommandPaletteExamples } from "./CommandPaletteExamples";
import { datePickerCode, DatePickerExamples } from "./DatePickerExamples";
import { descriptionListCode, DescriptionListExamples } from "./DescriptionListExamples";
import { elementsCode, ElementsExamples } from "./ElementsExamples";
import { feedbackAlertsCode, FeedbackAlertsExamples } from "./FeedbackAlertsExamples";
import { feedCode, FeedExamples } from "./FeedExamples";
import { fileUploadCode, infiniteScrollSelectCode, FileUploadAndScrollSelectExamples } from "./FileUploadAndScrollSelectExamples";
import { formCode, FormExamples } from "./FormExamples";
import { gridListCode, GridListExamples } from "./GridListExamples";
import { headingsCode, HeadingsExamples } from "./HeadingsExamples";
import { inputCode, InputExamples } from "./InputExamples";
import { inputGroupCode, InputGroupExamples } from "./InputGroupExamples";
import { layoutCode, LayoutExamples } from "./LayoutExamples";
import { navigationCode, NavigationExamples } from "./NavigationExamples";
import { overlaysCode, OverlaysExamples } from "./OverlaysExamples";
import { paginatedSelectCode, PaginatedSelectExamples } from "./PaginatedSelectExamples";
import { progressCode, ProgressExamples } from "./ProgressExamples";
import { selectCode, SelectExamples } from "./SelectExamples";
import { stackedListCode, StackedListExamples } from "./StackedListExamples";
import { statsCode, StatsExamples } from "./StatsExamples";
import { switchCode, SwitchExamples } from "./SwitchExamples";
import { tableCode, TableExamples } from "./TableExamples";
import { textareaCode, TextareaExamples } from "./TextareaExamples";

export const codeSnippets = [
  {
    title: "Buttons",
    description: "Standard buttons for user actions and form submissions",
    component: ButtonExamples,
    code: buttonCode,
  },
  {
    title: "Form Elements",
    description: "Input fields, labels, and form controls",
    component: FormExamples,
    code: formCode,
  },
  {
    title: "Cards",
    description: "Versatile content containers with various configurations",
    component: CardExamples,
    code: cardCode,
  },
  {
    title: "Tables",
    description: "Data tables for displaying structured information",
    component: TableExamples,
    code: tableCode,
  },
  {
    title: "File Upload & Scrollable Select",
    description: "File upload component and infinite scrolling dropdown with filtering",
    component: FileUploadAndScrollSelectExamples, 
    code: `${fileUploadCode}\n\n${infiniteScrollSelectCode}`,
  },
  {
    title: "UI Elements",
    description: "Small reusable interface components like avatars, badges, tooltips",
    component: ElementsExamples,
    code: elementsCode,
  },
  {
    title: "Navigation",
    description: "Navigation bars, tabs, and menus for application structure",
    component: NavigationExamples,
    code: navigationCode,
  },
  {
    title: "Select Dropdowns",
    description: "Standard select and dropdown menus",
    component: SelectExamples,
    code: selectCode,
  },
  {
    title: "Paginated Select Dropdown",
    description: "Select dropdown with pagination features",
    component: PaginatedSelectExamples,
    code: paginatedSelectCode,
  },
  {
    title: "Inputs",
    description: "Text inputs for collecting user information",
    component: InputExamples,
    code: inputCode,
  },
  {
    title: "Input Groups",
    description: "Grouped input fields with labels and actions",
    component: InputGroupExamples,
    code: inputGroupCode,
  },
  {
    title: "Feedback & Alerts",
    description: "Notifications, alerts, and status indicators",
    component: FeedbackAlertsExamples,
    code: feedbackAlertsCode,
  },
  {
    title: "Checkboxes & Toggles",
    description: "Binary selection controls for forms",
    component: CheckboxExamples,
    code: checkboxCode,
  },
  {
    title: "Switches",
    description: "Toggle switches for boolean settings",
    component: SwitchExamples,
    code: switchCode,
  },
  {
    title: "Date Pickers",
    description: "Calendar and date selection components",
    component: DatePickerExamples,
    code: datePickerCode,
  },
  {
    title: "Textareas",
    description: "Multi-line text input fields",
    component: TextareaExamples,
    code: textareaCode,
  },
  {
    title: "Command Palette",
    description: "Command menus for quick actions and navigation",
    component: CommandPaletteExamples,
    code: commandPaletteCode,
  },
  {
    title: "Progress Indicators",
    description: "Progress bars, spinners, and loading states",
    component: ProgressExamples,
    code: progressCode,
  },
  {
    title: "Overlays",
    description: "Modals, dialogs, and popover elements",
    component: OverlaysExamples,
    code: overlaysCode,
  },
  {
    title: "Layouts",
    description: "Page layouts and content organization patterns",
    component: LayoutExamples,
    code: layoutCode,
  },
  {
    title: "Description Lists",
    description: "Term-description pairs for displaying metadata",
    component: DescriptionListExamples,
    code: descriptionListCode,
  },
  {
    title: "Stats",
    description: "Numerical data visualizations and statistics",
    component: StatsExamples,
    code: statsCode,
  },
  {
    title: "Headings",
    description: "Page and section titles with various styles",
    component: HeadingsExamples,
    code: headingsCode,
  },
  {
    title: "Feeds",
    description: "Activity feeds and timeline displays",
    component: FeedExamples,
    code: feedCode,
  },
  {
    title: "Stacked Lists",
    description: "Vertical lists with consistent styling",
    component: StackedListExamples,
    code: stackedListCode,
  },
  {
    title: "Grid Lists",
    description: "Grid-based content layouts for cards and items",
    component: GridListExamples,
    code: gridListCode,
  },
];
