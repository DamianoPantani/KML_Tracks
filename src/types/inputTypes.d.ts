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

type KMLStructure = {
  Folder: Folder;
  name: StringAttribute;
  Placemark?: Placemark | Placemark[];
};

type Folder = KMLStructure | KMLStructure[] | undefined;

// placemark

type Placemark = {
  LineString?: CoordString;
  Point?: CoordString;
  name?: StringAttribute;
  visibility?: StringAttribute;
};

type Route = Placemark & {
  LineString: CoordString;
};

type Point = Placemark & {
  Point: CoordString;
};

// attributes

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
