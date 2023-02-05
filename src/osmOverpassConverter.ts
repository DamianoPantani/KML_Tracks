import { toMultiTrackKml } from "./util/gpxConverter";
import { savePlaces } from "./util/fileIO";
import { readFileSync } from "fs";

(() => {
  const inputFilePath = "C:/Users/Damiano/Desktop/relation.json";

  console.log(`-- Parsing file: ${inputFilePath} --`);
  const inputString = readFileSync(inputFilePath, "utf8");

  console.log(`-- Extracting pois --`);
  const pois: Track[] = JSON.parse(inputString)
    .elements.filter((e: any) => e.members?.length)
    .flatMap((e: Record<string, unknown>): Track => {
      const { members, tags = {} } = e;
      const {
        "addr:city": city,
        altName,
        description,
        designation,
        local_name,
        name,
        official_name,
        reg_name,
        short_name,
      } = tags as Record<string, string>;

      return {
        coords: (members as Record<string, unknown>[])
          .filter(({ geometry, lat, lon }) => geometry || (lat && lon))
          .flatMap(({ geometry, lat, lon }) => (geometry ?? { lat, lon }) as Coord[]),
        name:
          [
            official_name,
            name,
            description,
            short_name,
            altName,
            local_name,
            reg_name,
            designation,
            city,
          ]
            .filter(Boolean)
            .join("; ") || ".",
      };
    });
  console.log(`-- Converting to file contents --`);
  const allSortedPois = pois
    .filter((p) => p.coords[0].lat && p.coords[0].lon && p.coords.length > 1)
    .sort((p1, p2) =>
      p2.coords[0].lat.toString().localeCompare(p1.coords[0].lat.toString())
    );

  const rowSize = 500;
  const colSize = 100;

  for (let i = 0; i < allSortedPois.length; i += rowSize) {
    const poisRow = allSortedPois
      .slice(i, i + rowSize)
      .sort((p1, p2) =>
        p1.coords[0].lon.toString().localeCompare(p2.coords[0].lon.toString())
      );

    for (let j = 0; j < poisRow.length; j += colSize) {
      const poisCol = poisRow.slice(j, j + colSize);
      const name = "viewpointsChunk_" + (i + j);

      const outputPlaces = toMultiTrackKml(name, poisCol);

      console.log(`-- Saving ${name} points file --`);
      savePlaces(outputPlaces, "C:/Users/Damiano/Desktop/vpt");
    }
  }

  console.log("-- DONE --");
})();
