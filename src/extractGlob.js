import glob from 'glob';
import extractFromFile from './extractFromFile';

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
                const output = Array.prototype.concat.apply([], strings);
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