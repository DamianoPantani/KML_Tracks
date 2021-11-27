import {
  Coord,
  GpxFolder,
  OutputFile,
  Track,
  TrackFolder,
} from "../types/outputTypes";

const availableColors = [
  "#a71de1",
  "#f52887",
  "#2ec6ff",
  "#ff0000",
  "#4e4eff",
  "#ff7200",
];

export function toOutputFolders(inputFolders: TrackFolder[]): GpxFolder[] {
  return inputFolders.map((f, i) => {
    const color = availableColors[i % availableColors.length];
    return {
      name: f.name,
      files: f.tracks.map((t) => toGpx(t, color)),
    };
  });
}

function toGpx(track: Track, color: string): OutputFile {
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
