export function getColor(category: string): string {
  return styleByCategory[category]?.color ?? defaultStyle.color;
}

export function getIcon(category: string): string {
  return styleByCategory[category]?.icon ?? defaultStyle.icon;
}

const defaultStyle = { color: "#eecc00", icon: "special_marker" };

const styleByCategory: Record<string, Style | undefined> = {
  "Miejsca - okolice": { color: "#14acca" },
  "Miejsca - Polska": { color: "#aa0000" },
  "Miejsca - Polska - latwo dostepne": defaultStyle,
  "Moto - Polska": { color: "#00aa22", icon: "special_motorcycle" },
  "Moto - trasy": { color: "#ff2288", icon: "special_motorcycle" },
  Rower: { color: "#6622aa", icon: "special_bicycle" },
  "Slabe drogi": { color: "#880000" },
};
