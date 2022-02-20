// document

type KML = {
  kml: {
    Document: KMLStructure;
  };
};

type MOKml = {
  znaczniki: {
    znacznik: MOPoint[];
  };
};

type KMLStructure = KMLNode & {
  Folder: Folder;
  Placemark?: Placemark | Placemark[];
};

type Folder = KMLStructure | KMLStructure[] | undefined;

// placemark

type Placemark = KMLNode & {
  LineString?: CoordString;
  Point?: CoordString;
};

type Route = Placemark & {
  LineString: CoordString;
};

type Point = Placemark & {
  Point: CoordString;
};

// attributes

type KMLNode = {
  name: StringAttribute;
  description?: StringAttribute;
  visibility?: StringAttribute;
};

type MOPoint = {
  _attributes: {
    lat: string;
    lng: string;
    nazwa: string;
    typ: string;
  };
};

type StringAttribute = {
  _text: string;
};

type CoordString = {
  coordinates: StringAttribute;
};

// output

type GroupedPlacemarks = {
  routes: Route[];
  points: Point[];
};
