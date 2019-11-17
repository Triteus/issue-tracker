
require('ts-node').register();
import { Seeder } from 'mongo-seeding';
import * as path from 'path';

const config = {
    database: 'mongodb://127.0.0.1:27017/issue_tracker',
    dropDatabase: false,
};
const seeder = new Seeder(config);

const collections = seeder.readCollectionsFromPath(path.resolve("./src/data"),
    {
        extensions: ['js', 'json', 'ts'],
        transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
    });

seeder.import(collections)
    .then(() => {
        console.info('Seeding successful!');
    })
    .catch((err) => {
        console.info('Seeding failed!');
    })