import latinize from "latinize";
import { Folder, Placemark, Route } from "../types/inputTypes";
import { Coord, Track, TrackFolder } from "../types/outputTypes";
import { FileNameIterator } from "./FileNameIterator";

export function extractTracks(
  folder: Folder,
  results: TrackFolder[]
): TrackFolder[] {
  if (Array.isArray(folder)) {
    return folder.flatMap((k) => extractTracks(k, results));
  }

  if (folder?.Folder) {
    return extractTracks(folder.Folder, results);
  }

  if (folder?.Placemark) {
    const allTracksInFolder = toTracks(folder.Placemark);

    if (allTracksInFolder.length) {
      const trackFolder: TrackFolder = {
        name: latinize(folder.name._text),
        tracks: allTracksInFolder,
      };

      return [...results, trackFolder];
    }
  }

  return results;
}

function toTracks(placemarks: Placemark[]): Track[] {
  const routes = placemarks.filter(isRoute);
  const fileNameIterator = new FileNameIterator();

  return routes.map<Track>((p) => ({
    name: fileNameIterator.next(latinize(p.name._text)),
    coords: parseCoords(p.LineString.coordinates._text),
  }));
}

function isRoute(placemark: Placemark): placemark is Route {
  return !!placemark.LineString;
}

function parseCoords(stringCoords: string): Coord[] {
  const coordTuples = stringCoords
    .replace(/[\n|\t]+/g, "")
    .trim()
    .split(" ");

  return coordTuples.map((t) => toCoords(t.split(",")));
}

function toCoords(tuple: string[]): Coord {
  return {
    lon: tuple[0],
    lat: tuple[1],
  };
}
