import { existsSync, mkdirSync, rmSync } from "fs";
import { extractTracks } from "./util/kmlExtractor";
import { toOutputFolders } from "./util/gpxConverter";
import { readKml, saveFolderStructure } from "./util/fileIO";
import { push } from "./util/adb";

// TODOs:
// bold extension property doesn't work
// export favorite points (with colors)
// existing tracks are not overriden - remove all first

(async () => {
  const tempOutputPath = "C:/Users/Damiano/Desktop/tracks";
  const inputFilePath = `C:/Users/Damiano/AppData/LocalLow/Google/GoogleEarth/myplaces.kml`;
  const deviceOutputPath = `storage/emulated/0/Android/data/net.osmand/files/tracks`;

  if (!inputFilePath) {
    console.error(`-- Cannot find input file: ${inputFilePath} --`);
    return;
  }

  if (existsSync(tempOutputPath)) {
    console.warn(
      `-- Temp Output directory ${tempOutputPath} already exists, removing --`
    );
    rmSync(tempOutputPath, { recursive: true });
  }

  console.log(`-- Parsing file: ${inputFilePath} --`);
  const kml = readKml(inputFilePath);

  console.log(`-- Extracting tracks --`);
  const trackFolders = extractTracks(kml.kml.Document.Folder, []);

  console.log(`-- Converting to file contents --`);
  const outputContents = toOutputFolders(trackFolders);

  console.log(`-- Saving ${trackFolders.length} output folders --`);
  mkdirSync(tempOutputPath);
  saveFolderStructure(outputContents, tempOutputPath);

  console.log(`-- Moving to device --`);
  try {
    await push(`${tempOutputPath}/.`, deviceOutputPath);
  } catch (e) {
    console.error(
      "Couldn't push files to device. Make sure all subfolders already exist and their names do not contain UTF-8 characters"
    );
    console.error(e);
  }

  console.log(`-- Cleaning up --`);
  rmSync(tempOutputPath, { recursive: true });

  console.log("-- DONE --");
})();
