import axios from "axios";
import { extractMotoOpiniePoints } from "./util/kmlExtractor";
import { toOutputKMLPlaces } from "./util/gpxConverter";
import { savePlaces, toKml } from "./util/fileIO";

(async () => {
  const tempOutputPath = "C:/Users/Damiano/Desktop";

  console.log(`-- Downloading points --`);
  const { data } = await axios.get<string>(
    "https://miejsca.moto-opinie.info/generatorXML.php?k=1.1.1.1.1.1.1.1.1.1.1.1.1.1.1"
  );

  console.log(`-- Converting points to XML --`);
  const { znaczniki } = toKml<MOKml>(data);

  console.log(`-- Extracting tracks --`);
  const { placesCatalog } = extractMotoOpiniePoints(znaczniki.znacznik);

  console.log(`-- Converting to file contents --`);
  const outputPlaces = toOutputKMLPlaces("places", placesCatalog);

  console.log(`-- Saving points file --`);
  savePlaces(outputPlaces, tempOutputPath);

  console.log("-- DONE --");
})();
