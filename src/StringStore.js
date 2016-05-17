// a reducer function that takes msg entries,
// deduping and combining msg entries when the strings are the same
function stringDedupReducer(acc, entry) {
    // init the map for fast string lookup
    if (!acc.map) {
        acc.map = {};
    }

    // init the accumulated array of string entries
    if (!acc.array) {
        acc.array = [];
    }

    if (acc.map[[entry.msgid, entry.msgctxt]]) {
        acc.map[[entry.msgid, entry.msgctxt]].loc = acc.map[[entry.msgid, entry.msgctxt]].loc.concat(entry.loc);
    } else {
        acc.map[[entry.msgid, entry.msgctxt]] = entry;
        acc.array.push(entry);
    }

    // reconcile with acc
    return acc;
}

/*
 * StringStore stores entries of strings, with deduping functionality
 */
export default class StringStore {
    constructor() {
        this._store = [];
    }

    // Merge a single entry (object) to the store
    add(input) {
        this._store.push(input);
        this.dedupStore();
    }

    // Merge an array of entries into the store
    addArray(input) {
        this._store = this._store.concat(input);
        this.dedupStore();
    }

    // Merge an array of arrays of entries into the store
    addMultipleArrays(input) {
        this._store = this._store.concat(...input);
        this.dedupStore();
    }

    dedupStore() {
        this._store = this._store.reduce(stringDedupReducer, {}).array;
    }

    toArray() {
        return this._store;
    }
}