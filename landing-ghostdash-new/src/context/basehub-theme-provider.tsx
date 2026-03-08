export type BaseHubTheme = {
  accent: string;
  grayScale: string;
};

const CONTRAST_WARNING_COLORS: (keyof typeof colors)[] = [
  "amber",
  "cyan",
  "green",
  "lime",
  "yellow",
];

function anyColorToRgb(color: string) {
  const parsed = oklch(color); // or use parse() for any format
  const converted = rgb(parsed);
  if (!converted) throw new Error(`Invalid color format: ${color}`);
  return {
    r: Math.round(converted.r * 255),
    g: Math.round(converted.g * 255),
    b: Math.round(converted.b * 255),
  };
}

export function BaseHubThemeProvider() {
  return (
    <Pump queries={[{ site: { settings: { theme: themeFragment } } }]}>
      {async (pumpData) => {
        "use server";
        const data = pumpData?.[0];
        const theme = data?.site?.settings?.theme;
        if (!theme) {
          return null;
        }

        const accent = colors[theme.accent];
        const grayScale = colors[theme.grayScale];

        const css = Object.entries(accent).map(([key, value]) => {
          const rgb = anyColorToRgb(value);

          return `--accent-${key}: ${value}; --accent-rgb-${key}: ${rgb.r}, ${rgb.g}, ${rgb.b};`;
        });

        Object.entries(grayScale).forEach(([key, value]) => {
          const rgb = anyColorToRgb(value);

          css.push(
            `--grayscale-${key}: ${value}; --grayscale-rgb-${key}: ${rgb.r}, ${rgb.g}, ${rgb.b};`,
          );
        });
        if (CONTRAST_WARNING_COLORS.includes(data.site.settings.theme.accent)) {
          css.push(`--text-on-accent: ${colors.gray[950]};`);
        }

        return (
          <style>{`
      :root {
        ${css.join("\n")}
      }
      `}</style>
        );
      }}
    </Pump>
  );
}
