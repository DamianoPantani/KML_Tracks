import {
  Coord,
  GpxFolder,
  OutputFile,
  Track,
  Place,
  Catalog,
} from "../types/outputTypes";

const availableColors = [
  "#a71de1",
  "#f52887",
  "#2ec6ff",
  "#ff0000",
  "#4e4eff",
  "#ff7200",
];

export function toOutputTracks(inputFolders: Catalog<Track>[]): GpxFolder[] {
  return inputFolders.map((f, i) => {
    const color = availableColors[i % availableColors.length];
    return {
      name: f.name,
      files: f.content.map((t) => toTrackGpx(t, color)),
    };
  });
}

export function toOutputPlaces(inputFolders: Catalog<Place>[]): OutputFile {
  return {
    name: "favourites.gpx",
    content: toPlacesGpx(inputFolders),
  };
}

function toTrackGpx(track: Track, color: string): OutputFile {
  const content = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.0" creator="GPSBabel - https://www.gpsbabel.org" xmlns="http://www.topografix.com/GPX/1/0">
  <trk>
  <name>${track.name}</name>
  <trkseg>
    ${track.coords.map(toTrkpt).join("")}
  </trkseg>
  <extensions>
  </extensions>
  <extensions>
    <show_arrows>false</show_arrows>
    <color>${color}</color>
    <split_type>no_split</split_type>
    <split_interval>0.0</split_interval>
    <width>11</width>
    <show_start_finish>false</show_start_finish>
    <coloring_type>solid</coloring_type>
  </extensions>
  </trk>
</gpx>
  `;

  return {
    name: `${track.name}.gpx`,
    content,
  };
}

function toTrkpt(coord: Coord): string {
  return `
      <trkpt lat="${coord.lat}" lon="${coord.lon}">
        <ele>0.000</ele>
      </trkpt>`;
}

function toPlacesGpx(catalog: Catalog<Place>[]): string {
  return `<?xml version='1.0' encoding='UTF-8' standalone='yes' ?>
  <gpx version="1.1" creator="OsmAnd 4.0.8" xmlns="http://www.topografix.com/GPX/1/1" xmlns:osmand="https://osmand.net" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
    <metadata>
      <name>favourites</name>
    </metadata>
    ${catalog
      .map((catalog, i) =>
        catalog.content
          .map(
            (place) => `
    <wpt lat="${place.coords.lat}" lon="${place.coords.lon}">
      <ele>0</ele>
      <name>${place.name}</name>
      <type>${catalog.name}</type>
      <extensions>
        <osmand:background>circle</osmand:background>
        <osmand:color>${
          availableColors[i % availableColors.length]
        }</osmand:color>
      </extensions>
    </wpt>
    `
          )
          .join("")
      )
      .join("")}
  </gpx>`;
}
