Sibling Focus Nav
A nav row that dims or blurs sibling links when one item is hovered or focused — padding-based spacing keeps the effect alive between items.

new
hover
Used in demos
Footer wordmark
Docs
Changelog
GitHub
Terms
Privacy
Other examples
Blur
Work
Studio
Journal
Contact
Installation
CLI
pnpm dlx shadcn@latest add https://animata.design/r/container/sibling-focus-nav.json
Copy
Manual
Run the following command
mkdir -p components/animata/container && touch components/animata/container/sibling-focus-nav.tsx
Copy
Paste the code
Open the newly created file and paste the following code:

import { type ComponentProps, createContext, use } from "react";
 
import { cn } from "@/lib/utils";
 
export type SiblingFocusNavMode = "opacity" | "blur";
 
const SiblingFocusNavModeContext = createContext<SiblingFocusNavMode>("opacity");
 
/** Opacity mode: dim siblings only while a link is hovered or focus-visible. */
export const siblingFocusNavOpacityGroupClassName = cn(
  "[&:has(>a:hover)>a:not(:hover)]:opacity-30",
  "[&:has(>a:focus-visible)>a:not(:focus-visible)]:opacity-30",
);
 
/** Blur mode: same sibling trick, but with blur-sm instead of opacity. */
export const siblingFocusNavBlurGroupClassName = cn(
  "[&:has(>a:hover)>a:not(:hover)]:blur-sm",
  "[&:has(>a:focus-visible)>a:not(:focus-visible)]:blur-sm",
  "motion-reduce:[&:has(>a:hover)>a:not(:hover)]:blur-none",
  "motion-reduce:[&:has(>a:focus-visible)>a:not(:focus-visible)]:blur-none",
);
 
const siblingFocusNavLinkBaseClassName = cn(
  "inline-flex min-h-11 touch-manipulation items-center outline-none focus-visible:ring-2 focus-visible:ring-ring",
);
 
/** Classes for direct-child links. Merge onto Next.js Link or use SiblingFocusNav.Link. */
export function siblingFocusNavLinkClassName(mode: SiblingFocusNavMode = "opacity") {
  return cn(
    siblingFocusNavLinkBaseClassName,
    mode === "opacity"
      ? "transition-opacity duration-200 ease-out motion-reduce:transition-none"
      : "blur-0 transition-[filter] duration-200 ease-out motion-reduce:transition-none",
  );
}
 
export function siblingFocusNavGroupClassName(mode: SiblingFocusNavMode = "opacity") {
  return mode === "blur" ? siblingFocusNavBlurGroupClassName : siblingFocusNavOpacityGroupClassName;
}
 
/** Horizontal separation — padding on links so hover survives the space between items. */
export const siblingFocusNavSpacingXClassName = "[&>a:not(:last-child)]:pe-6";
 
/** Vertical separation — same idea for stacked nav rows. */
export const siblingFocusNavSpacingYClassName = "[&>a:not(:last-child)]:pb-2.5";
 
type SiblingFocusNavSpacingAxis = "x" | "y" | "none";
 
type SiblingFocusNavRootProps = ComponentProps<"nav"> & {
  mode?: SiblingFocusNavMode;
  /** Padding-based link separation — keeps hover active between items (no flex gap). */
  spacingAxis?: SiblingFocusNavSpacingAxis;
};
 
function siblingFocusNavSpacingClassName(axis: SiblingFocusNavSpacingAxis) {
  if (axis === "y") return siblingFocusNavSpacingYClassName;
  if (axis === "none") return undefined;
  return siblingFocusNavSpacingXClassName;
}
 
function SiblingFocusNavRoot({
  mode = "opacity",
  spacingAxis = "x",
  className,
  ...props
}: SiblingFocusNavRootProps) {
  return (
    <SiblingFocusNavModeContext.Provider value={mode}>
      <nav
        className={cn(
          "flex flex-wrap items-center",
          siblingFocusNavSpacingClassName(spacingAxis),
          siblingFocusNavGroupClassName(mode),
          className,
        )}
        {...props}
      />
    </SiblingFocusNavModeContext.Provider>
  );
}
 
type SiblingFocusNavLinkProps = ComponentProps<"a"> & {
  mode?: SiblingFocusNavMode;
};
 
function SiblingFocusNavLink({ mode, className, ...props }: SiblingFocusNavLinkProps) {
  const contextMode = use(SiblingFocusNavModeContext);
  const resolvedMode = mode ?? contextMode;
 
  return <a className={cn(siblingFocusNavLinkClassName(resolvedMode), className)} {...props} />;
}
 
const SiblingFocusNav = Object.assign(SiblingFocusNavRoot, {
  Link: SiblingFocusNavLink,
  linkClassName: siblingFocusNavLinkClassName("opacity"),
  groupClassName: siblingFocusNavOpacityGroupClassName,
  getLinkClassName: siblingFocusNavLinkClassName,
  getGroupClassName: siblingFocusNavGroupClassName,
  spacingXClassName: siblingFocusNavSpacingXClassName,
  spacingYClassName: siblingFocusNavSpacingYClassName,
});
 
export default SiblingFocusNav;
export { SiblingFocusNavLink };
Copy
Usage
The primitive owns the group spotlight mechanic. You own the links — plain <a> tags or framework routers, as long as they render as direct <a> children.

Pass mode="opacity" (default) or mode="blur" on the nav. Links pick up the matching transition classes automatically when you use SiblingFocusNav.Link.

Horizontal rows use spacingAxis="x" (default). Stacked navs use spacingAxis="y". Do not use flex gap for separation — padding on each link keeps the hover spotlight active while you move between items.

import SiblingFocusNav from "@/animata/container/sibling-focus-nav";
 
<SiblingFocusNav mode="blur" aria-label="Footer">
  <SiblingFocusNav.Link href="/docs">Docs</SiblingFocusNav.Link>
  <SiblingFocusNav.Link href="/changelog">Changelog</SiblingFocusNav.Link>
</SiblingFocusNav>
Copy
Vertical stack (footer column):

<SiblingFocusNav mode="opacity" spacingAxis="y" aria-label="Explore" className="flex-col items-start">
  <SiblingFocusNav.Link href="/docs">Docs</SiblingFocusNav.Link>
  <SiblingFocusNav.Link href="/changelog">Changelog</SiblingFocusNav.Link>
</SiblingFocusNav>
Copy
Custom spacing — set spacingAxis="none" and apply padding on the nav:

<SiblingFocusNav
  spacingAxis="none"
  className="[&>a:not(:last-child)]:pe-8"
  aria-label="Studio"
>
  …
</SiblingFocusNav>
Copy
With Next.js Link, merge the mode-aware class helper onto each child anchor:

import Link from "next/link";
import SiblingFocusNav from "@/animata/container/sibling-focus-nav";
 
<SiblingFocusNav mode="opacity" spacingAxis="y" aria-label="Footer" className="flex-col items-start">
  <Link href="/docs" className={SiblingFocusNav.getLinkClassName("opacity")}>
    Docs
  </Link>
</SiblingFocusNav>
Copy
How it works
Pure CSS on the <nav> — no JavaScript state. Both modes animate with duration-200 ease-out; prefers-reduced-motion disables the transition and, in blur mode, skips the filter effect.

Spotlight only on a link — siblings dim only while a direct child <a> is hovered or focus-visible, using :has() so empty padding in the nav does not trigger the effect:

[&:has(>a:hover)>a:not(:hover)]:opacity-30
[&:has(>a:focus-visible)>a:not(:focus-visible)]:opacity-30
Copy
The active link is excluded with :not(:hover) / :not(:focus-visible) so it stays at full opacity (or unblurred) without fighting a reset rule.

Opacity — non-active links fade to opacity-30. Links use transition-opacity.

Blur — same sibling trick with blur-sm on non-active links. Links use blur-0 and transition-[filter].

Padding spacing, not gap — flex gap leaves dead space between hit targets; moving the pointer across that gap drops :hover and the spotlight flickers off. Separation is padding on each link instead:

Axis	Class	Default
Horizontal (spacingAxis="x")	[&>a:not(:last-child)]:pe-6	1.5rem end padding
Vertical (spacingAxis="y")	[&>a:not(:last-child)]:pb-2.5	0.625rem bottom padding
Export helpers: SiblingFocusNav.spacingXClassName and SiblingFocusNav.spacingYClassName.

SiblingFocusNav.Link adds min-h-11, touch-manipulation, and a focus-visible ring. Override with your own classes on each link.

Credits
Built by hari