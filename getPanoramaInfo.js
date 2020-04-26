const axios = require('axios');
const { altitude } = require('./pinStyling'); 

module.exports = {

    toPanoramaPromise: (currentPanos) => ({ panoid, category }, idx, { length }) => () => (
        currentPanos[panoid]
           ? Promise.resolve(currentPanos[panoid])
           : axios.get(`http://maps.google.com/cbk?output=json&panoid=${panoid}&cb_client=apiv3&v=4&dm=1&pm=1&ph=1&hl=en`)
                .then(({ data }) => {
                    const { Location } = data;
                    if (!Location) {
                        throw "No metadata";
                    }
                    const { description, region, country, lng, lat } = Location;
                    return {
                        isStreetView: true,
                        id: panoid,
                        category,
                        name: description || region || country,
                        longitude: lng,
                        latitude: lat,
                        Point: {
                            coordinates: `${lng},${lat},${altitude}`
                        }
                    }
                })
                .catch(() => axios.get(`https://maps.googleapis.com/maps/api/streetview/metadata?pano=${panoid}&key=AIzaSyBucGt0V4z6JlqDcciutoZaV6YmwpEJovs`)
                    .then(({ data }) => {
                        if (!data.location) {
                            throw "Could not find panorama";
                        }
                        const { location, copyright } = data;
                        const { lng, lat } = location;
                        return {
                            isStreetView: false,
                            id: panoid,
                            category,
                            name: copyright,
                            longitude: lng,
                            latitude: lat,
                            Point: {
                                coordinates: `${lng},${lat},${altitude}`
                            }
                        };
                    })
                )
                .catch(e => console.error(`${panoid}:`, e))
    )
    .finally(() => !(idx % 20) && console.log(`${100*idx/length}%`)),

    groupByCategory: (categories, pano) => {
        const category = categories[pano.category] = (categories[pano.category] || []);
        category.push(pano);
        return categories;
    },

    rename: (customNames) => (pano) => {
        pano.name = customNames[pano.id] || pano.name;
        return pano;
    }

};