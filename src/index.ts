import { readdirSync, existsSync, mkdirSync, rmSync } from "fs";
import { extractTracks } from "./util/kmlExtractor";
import { toOutputFolders } from "./util/gpxConverter";
import { readKml, saveFolderStructure } from "./util/fileIO";
import { push } from "./util/adb";

const searchDir = "C:/Users/Damiano/Desktop/";

// TODOs:
// bold extension property doesn't work
// auto import KML from google earth
// export favorite points (with colors)

(async () => {
  console.log(`-- Reading directory: ${searchDir} --`);
  const inputFileName = readdirSync(searchDir).find((f) => f.endsWith(".kml"));
  const inputFilePath = `${searchDir}${inputFileName}`;
  const outputPath = `${searchDir}tracks`;
  const deviceOutputPath = `storage/emulated/0/Android/data/net.osmand/files/tracks`;

  if (!inputFileName) {
    console.error(`-- No KMLS in ${searchDir} directory --`);
    return;
  }

  if (existsSync(outputPath)) {
    console.warn(
      `-- Output directory ${outputPath} already exists, removing --`
    );
    rmSync(outputPath, { recursive: true });
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

  console.log(`-- Moving to device --`);
  try {
    await push(`${outputPath}/.`, deviceOutputPath);
  } catch (e) {
    console.error(
      "Couldn't push files to device. Make sure all subfolders already exist and their names do not contain UTF-8 characters"
    );
    console.error(e);
  }

  console.log("-- DONE --");
})();
