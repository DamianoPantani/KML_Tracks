export function getColor(category: string): string {
  return styleByCategory[category]?.color ?? defaultStyle.color;
}

export function getIcon(category: string): string {
  return styleByCategory[category]?.icon ?? defaultStyle.icon;
}

// IMPORTANT: OsmAnd uses #AARRGGBB color format

const defaultStyle: Required<Style> = { color: "#ddbb00", icon: "special_marker" };

const styleByCategory: Record<string, Style | undefined> = {
  Okolice: { color: "#14acca" },
  "Polska - Trudne - Konieczne": { color: "#990000", icon: "special_heart" },
  "Polska - Trudne - Warte": { color: "#bbff0000" },
  "Polska - Latwe - Konieczne": { icon: "special_heart" },
  "Polska - Latwe - Warte": { color: "#bbffee00" },
  "Polska - Moto - Konieczne": { color: "#008811", icon: "special_motorcycle" },
  "Polska - Moto - Warte": { color: "#bb00aa22", icon: "special_enduro_motorcycle" },
  "Polska - Trasy": { color: "#ff2288", icon: "special_motorcycle" },
  Rower: { color: "#6622aa", icon: "special_bicycle" },
  "Slabe drogi": { color: "#880000" },
};
