/*
 * StringStore stores entries of strings, with deduping functionality
 */

const getValues = obj => Object.keys(obj).map(key => obj[key]);

function preprocess(str) {
    return str.replace(/\s+/g, ' ');
}

export default class StringStore {
    constructor() {
        this._store = {};
    }

    // Merge a single entry (object) to the store
    add(entry) {
        if (typeof entry.msgid === 'undefined' || entry.msgid === '') {
            return;
        }

        entry.msgid = preprocess(entry.msgid);
        if (this._store[[entry.msgid, entry.ctxtForTranslator]]) {
            this._store[[entry.msgid, entry.ctxtForTranslator]].loc = this._store[[entry.msgid, entry.ctxtForTranslator]].loc.concat(entry.loc);
        } else {
            this._store[[entry.msgid, entry.ctxtForTranslator]] = entry;
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