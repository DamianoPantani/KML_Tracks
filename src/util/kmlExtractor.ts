import latinize from "latinize";
import { FileNameIterator } from "./FileNameIterator";
import { getColor, getIcon } from "./style";

// recursive. gets list of folders and their contents
export function extractFavorites(
  folder: Folder,
  isNested?: boolean,
  folderNameSuffix = "",
  results: Favorites = { placesCatalog: [], tracksCatalog: [] }
): Favorites {
  if (Array.isArray(folder)) {
    folder.reduce(
      (_, f) => extractFavorites(f, true, folderNameSuffix, results),
      results
    );
  } else {
    const thisFolderName = folder?.name._text ?? "";
    // skip root folder name ("My Places")
    const nestedFolderName = isNested
      ? folderNameSuffix
        ? `${folderNameSuffix} - ${thisFolderName}`
        : thisFolderName
      : "";

    if (folder?.Folder) {
      extractFavorites(folder.Folder, true, nestedFolderName, results);
    }

    if (folder?.Placemark) {
      const { places, tracks } = splitFavorites(folder.Placemark);
      const catalogName = latinize(nestedFolderName);

      if (tracks.length) {
        results.tracksCatalog.push({
          name: catalogName,
          content: tracks,
          icon: "",
          color: getColor(catalogName),
        });
      }

      if (places.length) {
        results.placesCatalog.push({
          name: catalogName,
          content: places,
          icon: getIcon(catalogName),
          color: getColor(catalogName),
        });
      }
    }
  }

  return results;
}

// recursive. gets list of folders and their contents
export function extractMotoOpiniePoints(folder: MOPoint[]): Favorites {
  const createNewCatalog = (name: string): Catalog<Place> => ({
    name,
    icon: "",
    color: "",
    content: [],
  });

  const catalogs = folder.reduce<Record<string, Catalog<Place>>>(
    (acc, { _attributes }) => {
      const { lat, lng, nazwa, typ } = _attributes;
      const newPlace: Place = { name: nazwa, coords: { lat, lon: lng } };
      const catalog = acc[typ] ?? createNewCatalog(typ);

      catalog.content.push(newPlace);
      acc[typ] = catalog;
      return acc;
    },
    {}
  );

  return { placesCatalog: Object.values(catalogs), tracksCatalog: [] };
}

function splitFavorites(placemarks: Placemark | Placemark[]): ParsedCatalog {
  const tracksFileNameIterator = new FileNameIterator();
  const placesFileNameIterator = new FileNameIterator();
  const allPlacemarks = Array.isArray(placemarks) ? placemarks : [placemarks];
  const placemarkGroups: GroupedPlacemarks = { routes: [], points: [] };
  const { routes, points } = allPlacemarks
    .filter(isVisible)
    .reduce(splitByType, placemarkGroups);
  const untitled = "Untitled";

  const tracks = routes.map<Track>((r) => ({
    name: tracksFileNameIterator.next(latinize(r.name?._text ?? untitled)),
    coords: parseCoords(r.LineString),
  }));

  const places = points.map<Place>((p) => ({
    name: placesFileNameIterator.next(p.name?._text ?? untitled),
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
