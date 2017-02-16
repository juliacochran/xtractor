import fs from 'graceful-fs';
import path from 'path';
import minimist from 'minimist';
import StringStore from './StringStore';
import parseJs from './parsers/js';
import parseNunjucks from './parsers/nunjucksjs';

const argv = minimist(process.argv.slice(2));

export default function(filepath, markers, callback) {
    callback = callback || function() {};
    return new Promise(function(resolve, reject) {
        fs.readFile(filepath, 'utf-8', function(err, source) {
            if (err) {
                reject(err);
                callback(err);
                return;
            }

            // intialize the store
            const store = new StringStore();

            switch (path.extname(filepath)) {
                case '.js':
                case '.jsx':
                    parseJs(source, filepath, markers, store);
                    break;
                case '.nunjucksjs':
                    parseNunjucks(source, filepath, markers, store);
                    break;
            }

            if (argv.verbose) {
                console.log(filepath);
            }

            const extractedStrings = store.toArray();
            resolve(extractedStrings);
            callback(null, extractedStrings);
        });
    });
}