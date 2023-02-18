// structure

type Favorites = {
  tracksCatalog: Catalog<Track>[];
  placesCatalog: Catalog<Place>[];
};

type Catalog<T> = {
  name: string;
  content: T[];
  icon: string;
  color: string;
  order: string;
};

type Track = {
  name: string;
  coords: Coord[];
};

type Place = {
  name: string;
  coords: Coord;
  evening: boolean;
  description: string;
};

type Coord = {
  lat: string;
  lon: string;
};

// output

type ParsedCatalog = {
  tracks: Track[];
  places: Place[];
};

type GpxFolder = {
  name: string;
  files: OutputFile[];
};

type OutputFile = {
  name: string;
  content: string;
};

type FolderStyle = {
  icon: string;
  color: string;
  order: string;
};

type PlaceStyle = {
  description: string;
  evening: boolean;
};
