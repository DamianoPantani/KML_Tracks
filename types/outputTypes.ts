export type Coord = {
  lat: string;
  lon: string;
};

export type Track = {
  name: string;
  coords: Coord[];
};

export type TrackFolder = {
  name: string;
  tracks: Track[];
};

export type OutputFile = {
  name: string;
  content: string;
};

export type GpxFolder = {
  name: string;
  files: OutputFile[];
};
