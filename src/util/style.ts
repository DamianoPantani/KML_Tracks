import { ConfigIniParser } from "config-ini-parser";

// IMPORTANT: OsmAnd uses #AARRGGBB color format
const DEFAULT_FOLDER_STYLE: FolderStyle = {
  color: "#ddbb00",
  icon: "special_marker",
  order: "0",
  isHidden: "false",
};

const DEFAULT_PLACE_STYLE: PlaceStyle = {
  description: "",
  evening: false,
};

export const parseFolderStyle = (node: KMLNode): FolderStyle => {
  const nodeConfig = node.description?._text;
  const nodeName = node.name._text;
  const prototype = DEFAULT_FOLDER_STYLE;

  if (!nodeConfig) {
    console.warn(
      `Folder '${nodeName}' doesn't contain 'description' tag with style metadata. Using default`
    );
    return prototype;
  }

  const configParser = new ConfigIniParser().parse(nodeConfig);

  return Object.entries(prototype).reduce((style, [key, defaultValue]) => {
    const styleKey = key as keyof FolderStyle;
    style[styleKey] =
      configParser.getOptionFromDefaultSection(styleKey, "") || defaultValue;

    return style;
  }, {} as FolderStyle);
};

export const parsePlaceStyle = (node?: StringAttribute): PlaceStyle => {
  const nodeConfig = node?._text;
  const prototype = DEFAULT_PLACE_STYLE;

  if (!nodeConfig) {
    return prototype;
  }

  const configParser = new ConfigIniParser().parse(nodeConfig);

  return Object.fromEntries(
    Object.entries(prototype).map(([key, defaultValue]) => [
      key,
      configParser.getOptionFromDefaultSection(key, "") || defaultValue,
    ])
  ) as PlaceStyle;
};
