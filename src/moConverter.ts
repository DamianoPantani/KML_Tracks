import { extractMotoOpiniePoints } from "./util/kmlExtractor";
import { toOutputKMLPlaces } from "./util/gpxConverter";
import { readKml, savePlaces } from "./util/fileIO";

(() => {
  const tempOutputPath = "C:/Users/Damiano/Desktop";
  const inputFilePath = "C:/Users/Damiano/Desktop/INPUT.kml";

  console.log(`-- Parsing file: ${inputFilePath} --`);
  const { znaczniki } = readKml<MOKml>(inputFilePath);

  console.log(`-- Extracting tracks --`);
  const { placesCatalog } = extractMotoOpiniePoints(znaczniki.znacznik);

  console.log(`-- Converting to file contents --`);
  const outputPlaces = toOutputKMLPlaces(placesCatalog);

  console.log(`-- Saving points file --`);
  savePlaces(outputPlaces, tempOutputPath);

  console.log("-- DONE --");
})();
