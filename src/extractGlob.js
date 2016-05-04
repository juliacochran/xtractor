import glob from 'glob';
import extractFromFile from './extractFromFile';

// a reducer function that takes multiple msg entries,
// deduping and combining msg entries when the strings are the same
function stringDedupReducer(acc, curr) {
    // init the map for fast string lookup
    if (!acc.map) {
        acc.map = {};
    }

    // init the accumulated array of string entries
    if (!acc.array) {
        acc.array = [];
    }

    // take each entry in curr, add it to the map if necessary
    curr.forEach(entry => {
        if (acc.map[entry.msgid]) {
            acc.map[entry.msgid].loc = acc.map[entry.msgid].loc.concat(entry.loc);
        } else {
            acc.map[entry.msgid] = entry;
            acc.array.push(entry);
        }
    });

    // reconcile with acc
    return acc;
}

export default function(globInput, markers, callback) {
    callback = callback || function() {};
    return new Promise(function(resolve, reject) {
        glob(globInput, function (err, files) {
            if (err) {
                reject(err);
                callback(err);
                return;
            }

            Promise.all(files.map(filepath => extractFromFile(filepath, markers)))
            .then(strings => {
                const output = strings.reduce(stringDedupReducer, {}).array;
                resolve(output);
                callback(null, output);
            })
            .catch(err => {
                reject(err);
                callback(err);
            });
        });
    });
}