const fs = require('fs');
const { toXML } = require('jstoxml');
const convert = require('xml-js');
const { default: PQueue } = require('p-queue');
const toPanoramaPromise = require('./getPanoramaInfo');
const { groupByCategory, toKml, fromKml } = require('./panoramasToXml');

const promiseQueue = new PQueue({ concurrency: 4 });

const sourceFile = 'resources/Wander_Favorites.json';
const outuptAllFile = 'resources/Wander_Favorites.kml';
const outputNewFile = 'resources/Wander_Favorites_NEW.kml';

(async () => {

    console.log("-- Reading files --");
    const favoritesJson = fs.readFileSync(sourceFile, 'utf8');
    const favoritesKml = fs.existsSync(outuptAllFile) ?
        fs.readFileSync(outuptAllFile, 'utf8')
        : "";
    
    console.log("-- Parsing files --");
    const favorites = JSON.parse(favoritesJson);
    const currentFavorites = JSON.parse(convert.xml2json(favoritesKml, { compact: true }));
    
    console.log("-- Processing data --");
    const currentPanos = fromKml(currentFavorites);
    const panoPromises = favorites.flatMap(({ folderContents, title }) => 
        folderContents.map(p => {
            p.category = title;
            return p;
        })
    ).map(toPanoramaPromise(currentPanos))

    console.log("-- Fetching results --");
    const panos = await promiseQueue.addAll(panoPromises)
        .then(res => res.filter(Boolean));
    
    console.log("-- Processing results --");
    const allCategories = panos.reduce(groupByCategory, {});
    const newCategories = panos.filter(p => !p.isStored).reduce(groupByCategory, {});
    
    console.log("-- Saving results --");
    fs.writeFileSync(outuptAllFile, toXML(toKml(allCategories), {
        header: true,
        indent: '    ',
        _selfCloseTag: false
    }), "UTF-8");
    fs.writeFileSync(outputNewFile, toXML(toKml(newCategories), {
        header: true,
        indent: '    ',
        _selfCloseTag: false
    }), "UTF-8");

    console.log("-- DONE --");
    
})();
