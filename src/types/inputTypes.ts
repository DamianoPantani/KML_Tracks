export type StringAttribute = {
  _text: string;
};

export type LineString = {
  coordinates: StringAttribute;
};

export type Placemark = {
  LineString?: LineString;
  name: StringAttribute;
};

export type Route = Placemark & {
  LineString: LineString;
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
