module.exports = {
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
    altitude: 2.5,
    heading: 0,
    tilt: 90,
    roll: 0,
  }),

  Style: () => ({
    IconStyle: {
      Icon: {
        href: ":/motorcycling.png",
      },
    },
    ListStyle: {
      listItemType: "check",
      ItemIcon: {
        state: "open closed error fetching0 fetching1 fetching2",
        href: "http://maps.google.com/mapfiles/kml/shapes/motorcycling.png",
      },
      bgColor: "00ffffff",
      maxSnippetLines: 2,
    },
  }),
};
