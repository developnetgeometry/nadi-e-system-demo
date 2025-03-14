
import React from "react";
import {
  AvatarsExample,
  BadgesExample,
  ButtonGroupsExample,
  DropdownsExample,
  HoverCardsExample,
  ScrollAreaExample,
  TabsExample,
  TooltipsExample,
  avatarsCode,
  badgesCode,
  buttonGroupsCode,
  dropdownsCode,
  hoverCardsCode,
  scrollAreaCode,
  tabsCode,
  tooltipsCode,
} from "./elements";

export const ElementsExamples = () => {
  return (
    <div className="grid gap-8">
      <AvatarsExample />
      <BadgesExample />
      <DropdownsExample />
      <ButtonGroupsExample />
      <TooltipsExample />
      <HoverCardsExample />
      <ScrollAreaExample />
      <TabsExample />
    </div>
  );
};

export const elementsCode = `{/* Avatars */}
${avatarsCode}

{/* Badges */}
${badgesCode}

{/* Dropdowns */}
${dropdownsCode}

{/* Button Groups */}
${buttonGroupsCode}

{/* Tooltips */}
${tooltipsCode}

{/* Hover Cards */}
${hoverCardsCode}

{/* Scroll Area */}
${scrollAreaCode}

{/* Tabs */}
${tabsCode}`;
