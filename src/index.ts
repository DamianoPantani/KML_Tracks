import { homedir } from "os";
import { extractFavorites } from "./util/kmlExtractor";
import { toOutputTracks, toOutputGPXPlaces } from "./util/gpxConverter";
import { cleanUp, readFileAsKml, saveFolderStructure, savePlaces } from "./util/fileIO";
import { push, stopApp, startApp, removeContent } from "./util/adb";
import { byOrderAttribute, renameByOrder } from "./util/mapReduce";
import { wait } from "./util/util";

const homeDir = homedir();

// TODOs:
// you have to manually remove points / tracks beforehand - https://github.com/osmandapp/Osmand/issues/2750#issuecomment-981074188

(async () => {
  const targetAppName = "net.osmand"; // OR "net.osmand.plus";
  const tempOutputPath = `${homeDir}/Desktop`;
  const inputFilePath = `${homeDir}/AppData/LocalLow/Google/GoogleEarth/myplaces.kml`;
  const deviceOutputPath = `storage/emulated/0/Android/obb/${targetAppName}`;

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

    console.log(`-- Starting the app, please wait a few seconds... --`);
    startApp(targetAppName);

    await wait(4000);

    console.log(`-- Removing device favorites file --`);
    removeContent(`${deviceOutputPath}/favorites/`); // without this you cannot manually remove favs on your device, they will re-appear when you reopen OsmAnd app
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
