import latinize from "latinize";
import {
  CoordString,
  Folder,
  Placemark,
  Point,
  Route,
} from "../types/inputTypes";
import {
  Coord,
  Track,
  Favorites,
  ParsedCatalog,
  Place,
} from "../types/outputTypes";
import { FileNameIterator } from "./FileNameIterator";

const untitled = "Untitled";

export function extractFavorites(
  folder: Folder,
  results: Favorites = { placesCatalog: [], tracksCatalog: [] }
): Favorites {
  if (Array.isArray(folder)) {
    folder.reduce((_, f) => extractFavorites(f, results), results);
  } else {
    if (folder?.Folder) {
      extractFavorites(folder.Folder, results);
    }

    if (folder?.Placemark) {
      const { places, tracks } = splitFavorites(folder.Placemark);
      const catalogName = latinize(folder.name._text);

      if (tracks.length) {
        results.tracksCatalog.push({
          name: catalogName,
          content: tracks,
        });
      }

      if (places.length) {
        results.placesCatalog.push({
          name: catalogName,
          content: places,
        });
      }
    }
  }

  return results;
}

function splitFavorites(placemarks: Placemark | Placemark[]): ParsedCatalog {
  const allPlacemarks = Array.isArray(placemarks) ? placemarks : [placemarks];
  const visiblePlacemarks = allPlacemarks.filter(isVisible);

  const routes = visiblePlacemarks.filter(isRoute);
  const points = visiblePlacemarks.filter(isPoint);

  const fileNameIterator = new FileNameIterator();
  const tracks = routes.map<Track>((r) => ({
    name: fileNameIterator.next(latinize(r.name?._text ?? untitled)),
    coords: parseCoords(r.LineString),
  }));

  const places = points.map<Place>((p) => ({
    name: p.name?._text ?? untitled,
    coords: parseCoords(p.Point)[0],
  }));

  return { tracks, places };
}

function isVisible(placemark: Placemark) {
  return placemark.visibility?._text !== "0";
}

function isRoute(placemark: Placemark): placemark is Route {
  return !!placemark.LineString;
}

function isPoint(placemark: Placemark): placemark is Point {
  return !!placemark.Point;
}

function parseCoords(rawCoords: CoordString): Coord[] {
  const coordTuples = rawCoords.coordinates._text
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
