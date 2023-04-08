import { homedir } from "os";
import { extractFavorites } from "./util/kmlExtractor";
import { toOutputTracks, toOutputGPXPlaces } from "./util/gpxConverter";
import { cleanUp, readFileAsKml, saveFolderStructure, savePlaces } from "./util/fileIO";
import { push, stopApp } from "./util/adb";
import { byOrderAttribute, renameByOrder } from "./util/mapReduce";

const homeDir = homedir();

// TODOs:
// tracks are hidden by default
// you have to manually remove points / tracks beforehand - https://github.com/osmandapp/Osmand/issues/2750#issuecomment-981074188

(() => {
  const targetAppName = "net.osmand"; // OR "net.osmand.plus";
  const tempOutputPath = `${homeDir}/Desktop`;
  const inputFilePath = `${homeDir}/AppData/LocalLow/Google/GoogleEarth/myplaces.kml`;
  const deviceOutputPath = `storage/emulated/0/Android/data/${targetAppName}/files`;

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
  const tracksOutputPath = saveFolderStructure(outputTracks, `${tempOutputPath}/tracks`);
  console.log(`-- Saving points file --`);
  const pointsOutputFilePath = savePlaces(outputPlaces, tempOutputPath);

  try {
    console.log(`-- Moving to device --`);
    stopApp(targetAppName);
    push(pointsOutputFilePath, `${deviceOutputPath}/favorites`);
    outputTracks.forEach((trackDir) =>
      trackDir.files.forEach((track) =>
        push(
          `${tracksOutputPath}/${trackDir.name}/${track.name}`,
          `${deviceOutputPath}/tracks/${trackDir.name}/${track.name}`
        )
      )
    );
    console.log(`-- Cleaning up --`);
    cleanUp(tracksOutputPath, pointsOutputFilePath);
  } catch (e) {
    const { message } = e as Error;
    const dirs = outputTracks.map((f) => f.name).join(", ");
    console.error(message);
    console.error(
      `Make sure all subfolders already exist: (${dirs}). If not, move generated tracks manually`
    );
  }

  console.log("-- DONE --");
})();
