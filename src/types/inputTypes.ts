export type StringAttribute = {
  _text: string;
};

export type CoordString = {
  coordinates: StringAttribute;
};

export type Placemark = {
  LineString?: CoordString;
  Point?: CoordString;
  name?: StringAttribute;
  visibility?: StringAttribute;
};

export type Route = Placemark & {
  LineString: CoordString;
};

export type Point = Placemark & {
  Point: CoordString;
};

export type Folder = KMLStructure | KMLStructure[] | undefined;

export type KMLStructure = {
  Folder: Folder;
  name: StringAttribute;
  Placemark?: Placemark | Placemark[];
};

export type KML = {
  kml: {
    Document: KMLStructure;
  };
};
