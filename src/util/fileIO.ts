import { createWriteStream, mkdirSync, readFileSync, writeFileSync } from "fs";
import JSZip from "jszip";
import { xml2json } from "xml-js";
import { KML } from "../types/inputTypes";
import { GpxFolder } from "../types/outputTypes";

export function readKml(inputFilePath: string): KML {
  const fullKml = readFileSync(inputFilePath, "utf8");
  return JSON.parse(xml2json(fullKml, { compact: true }));
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
  trackFolders.forEach((folder) => {
    const subFolderPath = `${path}/${folder.name}`;
    mkdirSync(subFolderPath);
    folder.files.map((f) => {
      const outputFilePath = `${subFolderPath}/${f.name}`;
      writeFileSync(outputFilePath, f.content, { encoding: "utf-8" });
    });
  });
}
