export function toOutputTracks(inputFolders: Catalog<Track>[]): GpxFolder[] {
  return inputFolders.map((f) => {
    return {
      name: f.name.replaceAll(" ", "_"),
      files: f.content.map((t) => toTrackGpx(t, f.color)),
    };
  });
}

export function toOutputGPXPlaces(inputFolders: Catalog<Place>[]): OutputFile {
  return {
    name: "favorites.gpx",
    content: toPlacesGpx(inputFolders),
  };
}

export function toOutputKMLPlaces(
  name: string,
  inputFolders: Catalog<Place>[]
): OutputFile {
  return {
    name: `${name}.kml`,
    content: toPlacesKml(inputFolders),
  };
}

function toTrackGpx(track: Track, color: string): OutputFile {
  const content = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.0" creator="GPSBabel - https://www.gpsbabel.org" xmlns="http://www.topografix.com/GPX/1/0">
  <trk>
    <name>${track.name}</name>
    <trkseg>${track.coords
      .map(
        (c) => `
      <trkpt lat="${c.lat}" lon="${c.lon}">
        <ele>0</ele>
      </trkpt>`
      )
      .join("")}
    </trkseg>
  </trk>
  <extensions>
    <osmand:color>${color}</osmand:color>
    <osmand:split_type>no_split</osmand:split_type>
    <osmand:split_interval>0.0</osmand:split_interval>
    <osmand:width>7</osmand:width>
    <osmand:show_start_finish>false</osmand:show_start_finish>
    <osmand:coloring_type>solid</osmand:coloring_type>
  </extensions>
</gpx>
  `;

  return {
    name: `${track.name.replaceAll(" ", "_")}.gpx`,
    content,
  };
}

export function toMultiTrackKml(name: string, tracks: Track[]): OutputFile {
  const content = `<?xml version="1.0" encoding="UTF-8"?>
  <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
  <Document>
    <name>${name}.kml</name>
    <Style id="liineStyle">
      <LineStyle>
        <color>ff0000ff</color>
        <width>3</width>
      </LineStyle>
      <PolyStyle>
        <color>ff0000ff</color>
      </PolyStyle>
    </Style>
      <Folder>
        <name>${name}</name>${tracks
    .map(
      (track) => `
      <Placemark>
      <name>${track.name.replaceAll("&", "'n")}</name>
      <styleUrl>#liineStyle</styleUrl>
      <LineString>
        <tessellate>1</tessellate>
        <coordinates>
          ${track.coords.map((c) => `${c.lon},${c.lat},0 `)}
        </coordinates>
      </LineString>
    </Placemark>`
    )
    .join("")}
      </Folder>
  </Document>
  </kml>`;

  return {
    name: `${name}.kml`,
    content,
  };
}

function toPlacesGpx(catalogs: Catalog<Place>[]): string {
  return `<?xml version='1.0' encoding='UTF-8' standalone='yes' ?>
<gpx version="1.1" creator="OsmAnd 4.4.6" xmlns="http://www.topografix.com/GPX/1/1" xmlns:osmand="https://osmand.net" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>favorites</name>
  </metadata>${catalogs
    .map((catalog) =>
      catalog.content
        .map(
          ({ coords, description, evening, name }) => `
  <wpt lat="${coords.lat}" lon="${coords.lon}">
    <time>${new Date().toISOString()}</time>
    <name>${name}</name>
    <type>${catalog.name}</type>
    ${description && `<desc>${description}</desc>`}
    <extensions>
      <osmand:icon>${evening ? "special_sunset" : catalog.icon}</osmand:icon>
      <osmand:background>${evening ? "square" : "circle"}</osmand:background>
      <osmand:color>${catalog.color}</osmand:color>
      ${catalog.isHidden ? "<osmand:hidden>true</osmand:hidden>" : ""}
    </extensions>
  </wpt>`
        )
        .join("")
    )
    .join("")}
    ${catalogs
      .map(
        ({ name, color, icon }) => `
    <extensions>
      <osmand:points_groups>
        <group name="${name}" color="${color}" icon="${icon}" background="circle" />
      </osmand:points_groups>
    </extensions>
    `
      )
      .join("")}
</gpx>`;
}

function toPlacesKml(catalog: Catalog<Place>[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
<Document>
	<name>Places.kml</name>
    ${catalog
      .map(
        (category) => `
    ${category.content
      .map(
        (point) => `
        <Placemark>
				  <name>${point.name.replaceAll("&", "'n")}</name>
				  <Point>
					  <coordinates>${point.coords.lon},${point.coords.lat},0</coordinates>
				  </Point>
			  </Placemark>`
      )
      .join("")}`
      )
      .join("")}
</Document>
</kml>`;
}
