import fs from 'fs';
import path from 'path';
import StringStore from './StringStore';
import parseJs from './parsers/js';

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
            }

            const extractedStrings = store.toArray();
            resolve(extractedStrings);
            callback(null, extractedStrings);
        });
    });
}