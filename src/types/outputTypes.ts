export type Coord = {
  lat: string;
  lon: string;
};

export type Track = {
  name: string;
  coords: Coord[];
};

export type Place = {
  name: string;
  coords: Coord;
};

export type ParsedCatalog = {
  tracks: Track[];
  places: Place[];
};

export type Catalog<T> = {
  name: string;
  content: T[];
};

export type OutputFile = {
  name: string;
  content: string;
};

export type GpxFolder = {
  name: string;
  files: OutputFile[];
};

export type Favorites = {
  tracksCatalog: Catalog<Track>[];
  placesCatalog: Catalog<Place>[];
};
