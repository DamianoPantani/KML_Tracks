import { ConfigIniParser } from "config-ini-parser";

// IMPORTANT: OsmAnd uses #AARRGGBB color format
export class StyleParser {
  // NOTE: must contain lower case values
  private static DEFAULT_STYLE: Style = {
    color: "#ddbb00",
    icon: "special_marker",
    order: "0",
  };

  private folder: KMLStructure;
  private dirName: string;

  constructor(folder: KMLStructure) {
    this.folder = folder;
    this.dirName = folder.name._text;
  }

  private get(parser: ConfigIniParser, key: keyof Style): string {
    const value = parser.getOptionFromDefaultSection(key, "") as string;
    if (!value) {
      console.warn(
        `Folder '${this.dirName}' doesn't contain '${key}' metadata. Using default`
      );
      return StyleParser.DEFAULT_STYLE[key];
    }

    return value.toLowerCase();
  }

  parseStyle(): Style {
    const configText = this.folder.description?._text;

    if (!configText) {
      console.warn(
        `Folder '${this.dirName}' doesn't contain 'description' tag with style metadata. Using default`
      );
      return StyleParser.DEFAULT_STYLE;
    }

    const configParser = new ConfigIniParser().parse(configText);

    return {
      color: this.get(configParser, "color"),
      icon: this.get(configParser, "icon"),
      order: this.get(configParser, "order"),
    };
  }
}
