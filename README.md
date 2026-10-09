# Japanese Study Journal

A React and JavaScript learning journal with Preparation and JLPT N5–N1 roadmaps. Checklist progress, the daily objective, theme, notes, and saved topics are stored in this browser profile with localStorage; there is no account or backend.

## Run locally

1. Install Node.js 20 or newer.
2. From this directory, run npm install.
3. Run npm run dev and open the local URL printed by Vite.
4. Run npm run build to create a production build in dist/.

## Data

The site starts with empty checklists, notes, and revision topics. Progress percentages are calculated from checked checklist items. Clearing browser site data can remove locally saved information; local storage is not a permanent backup.

## Structure

- src/data.js contains the roadmaps, checklists, study workflow, and resource catalog.
- src/App.jsx contains navigation, pages, interaction, and persistence logic.
- src/styles.css contains the responsive paper and ink themes.
