const fs = require('fs');
const { toXML } = require('jstoxml');
const convert = require('xml-js');
const { default: PQueue } = require('p-queue');
const { toPanoramaPromise, groupByCategory, fillData } = require('./getPanoramaInfo');
const { toKml, fromKml, xmlOptions } = require('./panoramasToXml');

const promiseQueue = new PQueue({ concurrency: 4 });

const sourceFile = 'resources/Wander_Favorites.json';
const outuptWebFile = 'resources/Wander_Favorites.kml';
const outputLocalFile = 'resources/Wander_Favorites_LOCAL.kml';
const outputLocalNewFile = 'resources/Wander_Favorites_LOCAL_NEW.kml';

(async () => {

    console.log("-- Reading files --");
    const favoritesJson = fs.readFileSync(sourceFile, 'utf8');
    const favoritesKml = fs.existsSync(outuptWebFile) ?
        fs.readFileSync(outuptWebFile, 'utf8')
        : "";
    
    console.log("-- Parsing files --");
    const favorites = JSON.parse(favoritesJson);
    const currentFavorites = JSON.parse(convert.xml2json(favoritesKml, { compact: true }));
    
    console.log("-- Processing data --");
    const currentPanos = fromKml(currentFavorites);
    const panoPromises = favorites.flatMap(({ folderContents, title }) => 
        folderContents.map(fillData(title))
    ).map(toPanoramaPromise(currentPanos))

    console.log("-- Fetching results --");
    const panos = await promiseQueue.addAll(panoPromises)
        .then(res => res.filter(Boolean));
    
    console.log("-- Processing results --");
    const allCategories = panos.reduce(groupByCategory, {});
    const newCategories = panos.filter(p => !p.isStored).reduce(groupByCategory, {});
    
    console.log("-- Saving results --");
    fs.writeFileSync(outuptWebFile, toXML(toKml(allCategories), xmlOptions), "UTF-8");
    fs.writeFileSync(outputLocalFile, toXML(toKml(allCategories, true), xmlOptions), "UTF-8");
    fs.writeFileSync(outputLocalNewFile, toXML(toKml(newCategories), xmlOptions), "UTF-8");

    console.log("-- DONE --");
    
})();
