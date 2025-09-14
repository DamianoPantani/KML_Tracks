import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { xml2json } from "xml-js";

// files specific utils:

export function cleanUp(...paths: string[]) {
  paths.forEach((p) => rmSync(p, { recursive: true }));
}

// app specific utils:

export function findKml(inputFilePath: string) {
  const name = readdirSync(inputFilePath).find((path) => path.endsWith(".kml"));

  return name ? `${inputFilePath}/${name}` : undefined;
}

export function readFileAsKml<T = KML>(inputFilePath: string): T {
  const fullKml = readFileSync(inputFilePath, "utf8");
  return toKml(fullKml);
}

export function toKml<T = KML>(inputString: string): T {
  return JSON.parse(xml2json(inputString, { compact: true }));
}

export function saveFolderStructure(trackFolders: GpxFolder[], outputPath: string) {
  if (existsSync(outputPath)) {
    console.warn(`-- Temp Output directory ${outputPath} already exists, removing --`);
    rmSync(outputPath, { recursive: true });
  }

  mkdirSync(outputPath, { recursive: true });

  trackFolders.forEach((folder) => {
    const subFolderPath = `${outputPath}/${folder.name}`;
    mkdirSync(subFolderPath, { recursive: true });
    folder.files.map((f) => {
      const outputFilePath = `${subFolderPath}/${f.name}`;
      writeFileSync(outputFilePath, f.content, { encoding: "utf-8" });
    });
  });

  return outputPath;
}

export function savePlaces(file: OutputFile, path: string) {
  const outputFilePath = `${path}/${file.name}`;
  if (existsSync(outputFilePath)) {
    console.warn(`-- Temp file ${file.name} already exists, removing --`);
    rmSync(outputFilePath);
  }

  mkdirSync(path, { recursive: true });
  writeFileSync(outputFilePath, file.content, { encoding: "utf-8" });

  return outputFilePath;
}
