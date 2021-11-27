import { extractFavorites } from "./util/kmlExtractor";
import { toOutputTracks, toOutputPlaces } from "./util/gpxConverter";
import {
  cleanUp,
  readKml,
  saveFolderStructure,
  savePlaces,
} from "./util/fileIO";
import { push } from "./util/adb";

// TODOs:
// bold extension property doesn't work
// color by input folder ?
// points import doesn't work
// existing tracks are not overriden - remove all first

// CODE:
// splitFavorites -> reduce (split by type)

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
    await push(`${tracksOutputPath}/.`, `${deviceOutputPath}/tracks`);
    await push(`${pointsOutputFilePath}`, deviceOutputPath);
  } catch (e) {
    console.error(
      "Couldn't push files to device. Make sure all subfolders already exist"
    );
    e && e instanceof Error && console.error(e.message);
  }

  console.log(`-- Cleaning up --`);
  cleanUp(tracksOutputPath, pointsOutputFilePath);

  console.log("-- DONE --");
})();
