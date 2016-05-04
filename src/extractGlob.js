import glob from 'glob';
import extractFromFile from './extractFromFile';
import StringStore from './StringStore';

export default function(globInput, markers, callback) {
    callback = callback || function() {};
    return new Promise(function(resolve, reject) {
        // allow globInput to possibly be an object
        let globPath;
        if (typeof globInput === "object") {
            // extract out globInput.glob, and pass the rest as options
            globPath = globInput.glob;
        } else {
            globPath = globInput;
        }
        glob(globPath, function (err, files) {
            if (err) {
                reject(err);
                callback(err);
                return;
            }

            Promise.all(files
                .filter(filepath => {
                    if (globInput.ignorePattern) {
                        return !filepath.match(globInput.ignorePattern)
                    } else {
                        return true;
                    }
                })
                .map(filepath => extractFromFile(filepath, markers))
            ).then(strings => {
                const store = new StringStore();
                store.addMultipleArrays(strings);
                const output = store.toArray();
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