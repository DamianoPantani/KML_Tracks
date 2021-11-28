import { extractFavorites } from "./util/kmlExtractor";
import { toOutputTracks, toOutputPlaces } from "./util/gpxConverter";
import {
  cleanUp,
  readKml,
  saveFolderStructure,
  savePlaces,
} from "./util/fileIO";
import { push, stopApp } from "./util/adb";

// TODOs:
// bold extension property doesn't work
// you have to manually remove points / tracks beforehand
// refactor

(async () => {
  const tempOutputPath = "C:/Users/Damiano/Desktop";
  const inputFilePath = `C:/Users/Damiano/AppData/LocalLow/Google/GoogleEarth/myplaces.kml`;
  const deviceOutputPath = `storage/emulated/0/Android/data/net.osmand/files`;

  if (!inputFilePath) {
    console.error(`-- Cannot find input file: ${inputFilePath} --`);
    return;
  }

  console.log(`-- Parsing file: ${inputFilePath} --`);
  const kml = readKml(inputFilePath);

  console.log(`-- Extracting tracks --`);
  const { tracksCatalog, placesCatalog } = extractFavorites(
    kml.kml.Document.Folder
  );

  console.log(`-- Converting to file contents --`);
  const outputTracks = toOutputTracks(tracksCatalog);
  const outputPlaces = toOutputPlaces(placesCatalog);

  console.log(`-- Saving ${tracksCatalog.length} output folders --`);
  const tracksOutputPath = saveFolderStructure(outputTracks, tempOutputPath);
  const pointsOutputFilePath = savePlaces(outputPlaces, tempOutputPath);

  console.log(`-- Moving to device --`);
  try {
    stopApp("net.osmand");
    push(`${tracksOutputPath}/.`, `${deviceOutputPath}/tracks`);
    push(pointsOutputFilePath, deviceOutputPath);
  } catch (e) {
    console.error(
      "Couldn't push files to device. Make sure all subfolders already exist"
    );
  }

  console.log(`-- Cleaning up --`);
  cleanUp(tracksOutputPath, pointsOutputFilePath);

  console.log("-- DONE --");
})();
