module.exports = {

  // TODO: when switching between images, sometimes we're going underground and camera stops
  altitude: 2.5,

  Camera: ({ longitude, latitude }) => ({
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
    altitude: this.altitude,
    heading: 0,
    tilt: 90,
    roll: 0,
  }),

  Style: (icon="motorcycling") => ({
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
