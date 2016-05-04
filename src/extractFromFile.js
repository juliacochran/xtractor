import fs from 'fs';
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
            const store = new StringStore();
            parseJs(source, filepath, markers, store);
            const extractedStrings = store.toArray();
            resolve(extractedStrings);
            callback(null, extractedStrings);
        });
    });
}