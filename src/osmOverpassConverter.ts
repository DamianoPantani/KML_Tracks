import { toOutputKMLPlaces } from "./util/gpxConverter";
import { savePlaces } from "./util/fileIO";
import { readFileSync } from "fs";
import { homedir } from "os";

const homeDir = homedir();

(() => {
  const inputFilePath = `${homeDir}/Desktop/v.json`;

  console.log(`-- Parsing file: ${inputFilePath} --`);
  const inputString = readFileSync(inputFilePath, "utf8");

  console.log(`-- Extracting pois --`);
  const pois: Track[] = JSON.parse(inputString).elements.flatMap(
    (e: Record<string, unknown>): Track => {
      const { geometry, lat, lon, tags = {} } = e;
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

      if (!geometry && !(lat || lon)) {
        debugger;
      }

      return {
        coords: (geometry ?? [{ lat, lon }]) as Coord[],
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
    }
  );
  console.log(`-- Converting to file contents --`);

  const allSortedPoints = pois
    .filter((p) => p.coords[0].lat && p.coords[0].lon && p.coords.length === 1)
    .sort((p1, p2) =>
      p2.coords[0].lat.toString().localeCompare(p1.coords[0].lat.toString())
    );

  const rowSize = 500;
  const colSize = 100;

  for (let i = 0; i < allSortedPoints.length; i += rowSize) {
    const poisRow = allSortedPoints
      .slice(i, i + rowSize)
      .sort((p1, p2) =>
        p1.coords[0].lon.toString().localeCompare(p2.coords[0].lon.toString())
      );

    for (let j = 0; j < poisRow.length; j += colSize) {
      const poisCol = poisRow.slice(j, j + colSize);
      const name = "viewpointsChunk_" + (i + j);

      const outputPlaces = toOutputKMLPlaces(name, [
        {
          color: "#111111",
          content: poisCol.map((t) => ({
            coords: t.coords[0],
            evening: false,
            name: t.name,
            description: "",
          })),
          icon: "",
          name,
          order: "1",
          isHidden: false,
        },
      ]);

      console.log(`-- Saving ${name} points file --`);
      savePlaces(outputPlaces, `${homeDir}/Desktop/vpt`);
    }
  }

  console.log("-- DONE --");
})();
