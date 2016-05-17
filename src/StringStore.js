/*
 * StringStore stores entries of strings, with deduping functionality
 */

const getValues = obj => Object.keys(obj).map(key => obj[key]);

export default class StringStore {
    constructor() {
        this._store = {};
    }

    // Merge a single entry (object) to the store
    add(entry) {
        if (this._store[[entry.msgid, entry.msgctxt]]) {
            this._store[[entry.msgid, entry.msgctxt]].loc = this._store[[entry.msgid, entry.msgctxt]].loc.concat(entry.loc);
        } else {
            this._store[[entry.msgid, entry.msgctxt]] = entry;
        }
    }

    // Merge an array of entries into the store
    addArray(entryArray) {
        entryArray.forEach(this.add.bind(this));
    }

    // Merge an array of arrays of entries into the store
    addMultipleArrays(entryArrayArray) {
        entryArrayArray.forEach(this.addArray.bind(this));
    }

    toArray() {
        return getValues(this._store);
    }
}