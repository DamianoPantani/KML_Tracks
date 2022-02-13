import { extractFavorites } from "./util/kmlExtractor";
import { toOutputTracks, toOutputGPXPlaces } from "./util/gpxConverter";
import { cleanUp, readFileAsKml, saveFolderStructure, savePlaces } from "./util/fileIO";
import { push, stopApp } from "./util/adb";
import { byOrderAttribute, renameByOrder } from "./util/mapReduce";

// TODOs:
// tracks are hidden by default
// you have to manually remove points / tracks beforehand - https://github.com/osmandapp/Osmand/issues/2750#issuecomment-981074188

(() => {
  const tempOutputPath = "C:/Users/Damiano/Desktop";
  const inputFilePath =
    "C:/Users/Damiano/AppData/LocalLow/Google/GoogleEarth/myplaces.kml";
  const deviceOutputPath = "storage/emulated/0/Android/data/net.osmand/files";

  if (!inputFilePath) {
    console.error(`-- Cannot find input file: ${inputFilePath} --`);
    return;
  }

  console.log(`-- Parsing file: ${inputFilePath} --`);
  const kml = readFileAsKml(inputFilePath);

  console.log(`-- Extracting tracks --`);
  const { tracksCatalog, placesCatalog } = extractFavorites(kml.kml.Document.Folder);
  const orderedPlacesCatalog = placesCatalog.sort(byOrderAttribute).map(renameByOrder);

  console.log(`-- Converting to file contents --`);
  const outputTracks = toOutputTracks(tracksCatalog);
  const outputPlaces = toOutputGPXPlaces(orderedPlacesCatalog);

  console.log(`-- Saving ${tracksCatalog.length} output track folders --`);
  const tracksOutputPath = saveFolderStructure(outputTracks, tempOutputPath);
  console.log(`-- Saving points file --`);
  const pointsOutputFilePath = savePlaces(outputPlaces, tempOutputPath);

  try {
    console.log(`-- Moving to device --`);
    stopApp("net.osmand");
    push(`${tracksOutputPath}/.`, `${deviceOutputPath}/tracks`);
    push(pointsOutputFilePath, deviceOutputPath);
  } catch (e) {
    console.error(
      "Couldn't push files to device. Make sure all subfolders already exist. If not, move generated tracks manually"
    );
  }

  console.log(`-- Cleaning up --`);
  cleanUp(tracksOutputPath, pointsOutputFilePath);

  console.log("-- DONE --");
})();
