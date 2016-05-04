
function buildOutput(path, data) {
    return Object.keys(data).map(function(key) {
        var split = key.split(':');
        var output = {
            msgid: split[0],
            loc: data[key].map(function(line) {
                return {
                    path: path,
                    line: line
                };
            })
        };
        if (split[1]) {
            output.msgctxt = split[1];
        }
        return output;
    });
}

module.exports = buildOutput;