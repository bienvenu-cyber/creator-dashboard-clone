// Static theme provider - no longer depends on BaseHub or culori
export type BaseHubTheme = {
  accent: string;
  grayScale: string;
};

/**
 * Since we no longer use BaseHub for theming,
 * this component is a no-op placeholder.
 * Theme colors are defined directly in globals.css.
 */
export function BaseHubThemeProvider() {
  return null;
}
