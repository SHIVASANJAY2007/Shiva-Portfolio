import { getProject } from '@theatre/core';

// Note: @theatre/studio is intentionally NOT loaded to avoid its UI overlay
// (bell icon, outline menu, toolbar). The project uses default/empty state,
// meaning all editable props fall back to their inline values.

// Initialize the About section animation project and sheet
export const aboutProject = getProject('ShivaPortfolioAbout');
export const knightSheet = aboutProject.sheet('KnightScene');
