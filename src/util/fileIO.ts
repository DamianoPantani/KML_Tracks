import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import JSZip from "jszip";
import { xml2json } from "xml-js";
import { KML } from "../types/inputTypes";
import { GpxFolder, OutputFile } from "../types/outputTypes";

export function readKml(inputFilePath: string): KML {
  const fullKml = readFileSync(inputFilePath, "utf8");
  return JSON.parse(xml2json(fullKml, { compact: true }));
}

export function cleanUp(...paths: string[]) {
  paths.forEach((p) => rmSync(p, { recursive: true }));
}

export async function saveTracksArchives(
  trackFolder: GpxFolder,
  path: string
): Promise<void> {
  const outuptArchive = `${path}/${trackFolder.name}.zip`;
  const zip = new JSZip();

  trackFolder.files.forEach((f) => zip.file(f.name, f.content));

  const archive = await zip.generateAsync({ type: "nodebuffer" });

  createWriteStream(outuptArchive).write(archive);
}

export function saveFolderStructure(trackFolders: GpxFolder[], path: string) {
  const outputPath = `${path}/tracks`;
  if (existsSync(outputPath)) {
    console.warn(
      `-- Temp Output directory ${outputPath} already exists, removing --`
    );
    rmSync(outputPath, { recursive: true });
  }

  mkdirSync(outputPath);

  trackFolders.forEach((folder) => {
    const subFolderPath = `${outputPath}/${folder.name}`;
    mkdirSync(subFolderPath);
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

  writeFileSync(outputFilePath, file.content, { encoding: "utf-8" });

  return outputFilePath;
}
