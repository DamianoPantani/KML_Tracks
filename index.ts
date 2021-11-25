import { readdirSync, existsSync, mkdirSync } from "fs";
import { extractTracks } from "./util/kmlExtractor";
import { toOutputFolders } from "./util/gpxConverter";
import { readKml, saveFolderStructure } from "./util/fileIO";

const searchDir = "C:/Users/Damiano/Desktop/";

// TODOs:
// bold extension property doesn't work
// move to phone automatically
// export favorite points (with colors)

(async () => {
  console.log(`-- Reading directory: ${searchDir} --`);
  const inputFileName = readdirSync(searchDir).find((f) => f.endsWith(".kml"));
  const inputFilePath = `${searchDir}${inputFileName}`;
  const outputPath = `${searchDir}tracks`;

  if (!inputFileName) {
    console.error(`-- No KMLS in ${searchDir} directory --`);
    return;
  }

  if (existsSync(outputPath)) {
    console.error(`-- Output directory ${searchDir} already exists --`);
    return;
  }

  console.log(`-- Parsing file: ${inputFileName} --`);
  const kml = readKml(inputFilePath);

  console.log(`-- Extracting tracks --`);
  const trackFolders = extractTracks(kml.kml.Document.Folder, []);

  console.log(`-- Converting to file contents --`);
  const outputContents = toOutputFolders(trackFolders);

  console.log(`-- Saving ${trackFolders.length} output folders --`);
  mkdirSync(outputPath);
  saveFolderStructure(outputContents, outputPath);

  // TODO: move to phone if connected

  console.log("-- DONE --");
})();
