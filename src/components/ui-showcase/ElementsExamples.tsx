
import React from "react";
import {
  AvatarsExample,
  BadgesExample,
  ButtonGroupsExample,
  DropdownsExample,
  HoverCardsExample,
  ScrollAreaExample,
  TooltipsExample,
  avatarsCode,
  badgesCode,
  buttonGroupsCode,
  dropdownsCode,
  hoverCardsCode,
  scrollAreaCode,
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

{/* Scroll Area */}
${scrollAreaCode}`;
