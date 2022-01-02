import { ConfigIniParser } from "config-ini-parser";

// IMPORTANT: OsmAnd uses #AARRGGBB color format

const defaultStyle: Style = { color: "#ddbb00", icon: "special_marker" };

export function getStyle(folder: KMLStructure): Style {
  const { name, description } = folder;
  const dirName = name._text;

  if (description) {
    const iniParser = new ConfigIniParser().parse(description._text);
    let color = iniParser.getOptionFromDefaultSection("color", "") as string;
    let icon = iniParser.getOptionFromDefaultSection("icon", "") as string;

    if (!color) {
      console.warn(`Folder '${dirName}' doesn't contain color metadata. Using default`);
      color = defaultStyle.color;
    }

    if (!icon) {
      console.warn(`Folder '${dirName}' doesn't contain icon metadata. Using default`);
      icon = defaultStyle.icon;
    }

    return { color, icon };
  }

  console.warn(
    `Folder '${dirName}' doesn't contain 'description' tag with style metadata. Using default`
  );

  return defaultStyle;
}
