import { ConfigIniParser } from "config-ini-parser";

// IMPORTANT: OsmAnd uses #AARRGGBB color format
export class StyleParser {
  private static DEFAULT_STYLE: Style = {
    color: "#ddbb00",
    icon: "special_marker",
    order: "0",
  };

  private nodeConfig?: string;
  private nodeName: string;

  constructor(node: KMLNode) {
    this.nodeConfig = node.description?._text;
    this.nodeName = node.name._text;
  }

  parseFolderStyle(): Style {
    const { nodeConfig, nodeName } = this;
    const prototype = StyleParser.DEFAULT_STYLE;

    if (!nodeConfig) {
      console.warn(
        `Folder '${nodeName}' doesn't contain 'description' tag with style metadata. Using default`
      );
      return prototype;
    }

    const configParser = new ConfigIniParser().parse(nodeConfig);

    return Object.entries(prototype).reduce((style, [key, defaultValue]) => {
      const styleKey = key as keyof Style;
      const value = configParser.getOptionFromDefaultSection(styleKey, "") as
        | string
        | undefined;

      if (value) {
        style[styleKey] = value;
      } else {
        style[styleKey] = defaultValue;
        console.warn(
          `Folder '${nodeName}' doesn't contain '${key}' metadata. Using default`
        );
      }

      return style;
    }, {} as Style);
  }
}
