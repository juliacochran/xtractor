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
        if (acc.map[[entry.msgid, entry.msgctxt]]) {
            acc.map[[entry.msgid, entry.msgctxt]].loc = acc.map[[entry.msgid, entry.msgctxt]].loc.concat(entry.loc);
        } else {
            acc.map[[entry.msgid, entry.msgctxt]] = entry;
            acc.array.push(entry);
        }
    });

    // reconcile with acc
    return acc;
}

export default class DedupMerger {
    constructor() {
        this.output = [];
    }

    merge(input) {
        this.output = [input, this.output].reduce(stringDedupReducer, {}).array;
    }

    mergeArray(input) {
        this.output = this.output.concat(input).reduce(stringDedupReducer, {}).array;
    }

    getOutput() {
        return this.output;
    }
}