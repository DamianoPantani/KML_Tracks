export function getColor(category: string): string {
  return styleByCategory[category]?.color ?? defaultStyle.color;
}

export function getIcon(category: string): string {
  return styleByCategory[category]?.icon ?? defaultStyle.icon;
}

const defaultStyle: Required<Style> = { color: "#eecc00", icon: "special_marker" };

const styleByCategory: Record<string, Style | undefined> = {
  "Okolice": { color: "#14acca" },
  "Polska - Konieczne - Trudne": { color: "#551111" },
  "Polska - Konieczne - Latwe": { color: "#aa0000" },
  "Polska - Konieczne - Moto": { color: "#006611", icon: "special_motorcycle" },
  "Polska - Warte - Trudne": defaultStyle,
  "Polska - Warte - Latwe": { color: "#ffee00" },
  "Polska - Warte - Moto": { color: "#00aa22", icon: "special_motorcycle" },
  "Polska - Trasy": { color: "#ff2288", icon: "special_motorcycle" },
  Rower: { color: "#6622aa", icon: "special_bicycle" },
  "Slabe drogi": { color: "#880000" },
};
