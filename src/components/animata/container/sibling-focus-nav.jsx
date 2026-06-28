import React, { createContext, useContext } from "react";
import classNames from "classnames";
import "./sibling-focus-nav.css";

const SiblingFocusNavModeContext = createContext("opacity");

export const siblingFocusNavOpacityGroupClassName = "siblingFocusNavOpacityGroup";
export const siblingFocusNavBlurGroupClassName = "siblingFocusNavBlurGroup";

const siblingFocusNavLinkBaseClassName = "siblingFocusNavLinkBase";

export function siblingFocusNavLinkClassName(mode = "opacity") {
  return classNames(
    siblingFocusNavLinkBaseClassName,
    mode === "opacity" ? "siblingFocusNavLinkOpacity" : "siblingFocusNavLinkBlur"
  );
}

export function siblingFocusNavGroupClassName(mode = "opacity") {
  return mode === "blur" ? siblingFocusNavBlurGroupClassName : siblingFocusNavOpacityGroupClassName;
}

export const siblingFocusNavSpacingXClassName = "siblingFocusNavSpacingX";
export const siblingFocusNavSpacingYClassName = "siblingFocusNavSpacingY";

function siblingFocusNavSpacingClassName(axis) {
  if (axis === "y") return siblingFocusNavSpacingYClassName;
  if (axis === "none") return undefined;
  return siblingFocusNavSpacingXClassName;
}

function SiblingFocusNavRoot({
  mode = "opacity",
  spacingAxis = "x",
  className,
  ...props
}) {
  return (
    <SiblingFocusNavModeContext.Provider value={mode}>
      <nav
        className={classNames(
          "siblingFocusNavRoot",
          siblingFocusNavSpacingClassName(spacingAxis),
          siblingFocusNavGroupClassName(mode),
          className
        )}
        {...props}
      />
    </SiblingFocusNavModeContext.Provider>
  );
}

function SiblingFocusNavLink({ mode, className, ...props }) {
  const contextMode = useContext(SiblingFocusNavModeContext);
  const resolvedMode = mode ?? contextMode;

  return <a className={classNames(siblingFocusNavLinkClassName(resolvedMode), className)} {...props} />;
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
