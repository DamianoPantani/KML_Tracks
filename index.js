const fs = require('fs');
const { toXML } = require('jstoxml');
const convert = require('xml-js');
const { default: PQueue } = require('p-queue');
const toPanoramaPromise = require('./getPanoramaInfo');
const { groupByCategory, toKml, fromKml } = require('./panoramasToXml');

const promiseQueue = new PQueue({ concurrency: 4 });

(async () => {

    console.log("-- Reading files --");
    const favoritesJson = fs.readFileSync('D:\\Damian\\Inne\\Wander_Favorites.json', 'utf8');
    const favoritesKml = fs.readFileSync('D:\\Damian\\Inne\\Wander_Favorites.kml', 'utf8');
    
    console.log("-- Parsing files --");
    const favorites = JSON.parse(favoritesJson);
    const currentFavorites = JSON.parse(convert.xml2json(favoritesKml, { compact: true }));
    
    console.log("-- Processing data --");
    const currentPanos = fromKml(currentFavorites);
    const panoPromises = favorites.flatMap(({ folderContents, title }) => 
        folderContents.map(toPanoramaPromise(currentPanos, title))
    );
    console.log("-- Fetching results --");
    const panos = await promiseQueue.addAll(panoPromises)
        .then(res => res.filter(Boolean));
    
    console.log("-- Processing results --");
    const allCategories = panos.reduce(groupByCategory, {});
    const newCategories = panos.filter(p => !p.fromKml).reduce(groupByCategory, {});
    
    console.log("-- Saving results --");
    fs.writeFileSync('D:\\Damian\\Inne\\Wander_Favorites.kml', toXML(toKml(allCategories), {
        header: true,
        indent: '    ',
        _selfCloseTag: false
    }), "UTF-8");
    fs.writeFileSync('D:\\Damian\\Inne\\Wander_Favorites_NEW.kml', toXML(toKml(newCategories), {
        header: true,
        indent: '    ',
        _selfCloseTag: false
    }), "UTF-8");

    console.log("-- DONE --");
    
})();
