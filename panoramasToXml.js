const { Camera, Style } = require('./pinStyling');

module.exports = {

  groupByCategory: (categories, pano) => {
    const category = categories[pano.category] = (categories[pano.category] || []);
    category.push(pano);
    return categories;
  },

  toKml: (groups) => Object
    .entries(groups)
    .reduce((kml, [category, panos]) => {
      kml.kml.Document.push({
        Folder: {
          name: category,
          _content: panos.map(pano =>
            pano.isStreetView ? {
              PhotoOverlay: {
                Camera: Camera(pano),
                Style: Style(),
                ...pano
              }
            } : {
              Placemark: {
                Style: Style("poi"),
                ...pano
              }
            }
          )
        }
      });
      return kml;
    }, {
      kml: {
        _attrs: {
          "xmlns": "http://www.opengis.net/kml/2.2",
          "xmlns:gx": "http://www.google.com/kml/ext/2.2",
          "xmlns:kml": "http://www.opengis.net/kml/2.2",
          "xmlns:atom": "http://www.w3.org/2005/Atom"
        },
        Document: []
      }
    }),

  fromKml: (favs) => (favs.kml && favs.kml.Document.Folder || [])
    .flatMap(f => [f.PhotoOverlay || [], f.Placemark || []])
    .flat()
    .reduce((acc, { id, isStreetView, name, longitude, latitude, category, Point }) => {
      acc[id._text] = {
        id: id._text,
        fromKml: true,
        isStreetView: isStreetView._text === "true",
        name: name._text,
        category: category._text,
        longitude: longitude._text,
        latitude: latitude._text,
        Point: {
          coordinates: Point.coordinates._text
        }
      }
      return acc;
  }, {})

};