Text Flipping Board
A split-flap display component that animates characters with flip transitions, inspired by Vestaboard.

text
special
hero

Preview

Code

@aceternity/text-flipping-board-demo


Copy prompt
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { TextFlippingBoard } from "../ui/text-flipping-board";
 
const MESSAGES: string[] = [
  "STAY HUNGRY \nSTAY IN BED \n- STEVE JOBS",
  "What did you get done this week?",
  "I burned $20 \nfor this shit.",
  "DONT WORRY \nBE HAPPY FFS.",
  "LADIES AND GENTLEMEN \nWELCOME TO F#!@# C!@$",
];
 
export function TextFlippingBoardDemo() {
  const [msgIdx, setMsgIdx] = useState(0);
 
  const next = useCallback(
    () => setMsgIdx((i) => (i + 1) % MESSAGES.length),
    [],
  );
 
  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);
 
  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 py-20">
      <TextFlippingBoard text={MESSAGES[msgIdx]} />
    </div>
  );
}

Copy
Select Language
Installation
CLI
Manual
Run the following command
npx shadcn@latest add @aceternity/text-flipping-board
Copy
Props
Prop	Type	Default	Description
text	string	-	Text to display on the board. Supports \n for explicit line breaks. Auto-wraps words to fit.
rows	string[]	-	Array of raw row strings for manual control. Supports color codes like {O} for orange tiles.
duration	number	~1.2	Total animation duration in seconds. All internal timings scale proportionally.
sound	boolean	false	Enable a synthesized mechanical flap sound on each character flip.
className	string	-	Additional CSS classes for the outer board container.