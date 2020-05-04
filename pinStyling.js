module.exports = {

  camera: ({ longitude, latitude }) => ({
    "gx:ViewerOptions": [
      {
        "gx:option": {
          _attrs: {
            enabled: "0",
            name: "historicalimagery",
          },
        },
      },
      {
        "gx:option": {
          _attrs: {
            enabled: "0",
            name: "sunlight",
          },
        },
      },
      {
        "gx:option": {
          _attrs: {
            name: "streetview",
          },
        },
      },
    ],
    longitude,
    latitude,
    altitude: 0,
    heading: 0,
    tilt: 89,
    roll: 0,
  }),

  camera360: ({ longitude, latitude, id }) => ({
    "gx:ViewerOptions": [
      {
        "gx:option": {
          _attrs: {
            name: "streetview",
          },
        },
      },
      {
        "gx:streetViewPanoId": `fife-media:${id}`,
      }
    ],
    longitude,
    latitude,
    altitude: 0,
    heading: 0,
    tilt: 89,
    roll: 0,
    "gx:fovy": 60,
    altitudeMode: "absolute"
  }),

  style: (icon="motorcycling") => ({
    IconStyle: {
			color: "ff00ffff",
      Icon: {
        href: `http://maps.google.com/mapfiles/kml/shapes/${icon}.png`
      }
    },
    ListStyle: {
      listItemType: "check",
      ItemIcon: {
        state: "open closed error fetching0 fetching1 fetching2",
        href: `http://maps.google.com/mapfiles/kml/shapes/${icon}.png`
      },
      bgColor: "00ffffff",
      maxSnippetLines: 2
    }
  }),
};
