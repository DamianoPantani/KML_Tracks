import latinize from "latinize";
import {
  CoordString,
  Folder,
  GroupedPlacemarks,
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

const defaultColor = "#eecc00";
const colorsByCategory: Record<string, string | undefined> = {
  "Miejsca - okolice": "#14acca",
  "Miejsca - Polska": "#aa0000",
  "Miejsca - Polska - latwo dostepne": defaultColor,
  "Moto - Polska": "#00aa22",
  "Moto - trasy": "#ff2288",
  Rower: "#6622aa",
  "Slabe drogi": "#880000",
};

const iconByCategory: Record<string, string | undefined> = {
  "Moto - Polska": "special_motorcycle",
  Rower: "special_bicycle",
};

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
          icon: "",
          color: colorsByCategory[catalogName] ?? defaultColor,
        });
      }

      if (places.length) {
        results.placesCatalog.push({
          name: catalogName,
          content: places,
          icon: iconByCategory[catalogName] ?? "special_marker",
          color: colorsByCategory[catalogName] ?? defaultColor,
        });
      }
    }
  }

  return results;
}

function splitFavorites(placemarks: Placemark | Placemark[]): ParsedCatalog {
  const fileNameIterator = new FileNameIterator();
  const allPlacemarks = Array.isArray(placemarks) ? placemarks : [placemarks];
  const placemarkGroups: GroupedPlacemarks = { routes: [], points: [] };
  const { routes, points } = allPlacemarks
    .filter(isVisible)
    .reduce(splitByType, placemarkGroups);

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

function splitByType(results: GroupedPlacemarks, placemark: Placemark) {
  isRoute(placemark) && results.routes.push(placemark);
  isPoint(placemark) && results.points.push(placemark);
  return results;
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
