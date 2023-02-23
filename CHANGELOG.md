# 0.6.0

## New

- Added support for
  - Bandcamp
  - Disney+
  - Netflix
- Added check to change icon theme based on browser theme
- Added eslint and prettier as formatters
- Added list of supported websites (+ unsupported elements) to readme
- Added Custom Site Editor
- Added TODOs and manifest file for version 3, but kept mv2 because of custom sites

## Changed

- Fixed support for
  - Twitch
- Restructured project
  - Formatted everything with eslint and prettier
  - Generalized website file structure
  - Changed file naming convention to kebab-case
- Moved options view from extension view to icon click
- Moved messages (outdated & not connected) to options view
- Added MusicInfo Enum for easier update event

## Removed

- Removed support for
  - Youtube Old (Because how and who tf is using this)
  - Google Play Music (no longer exists)
- Removed empty file for Napster