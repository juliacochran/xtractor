import gettextParser from 'gettext-parser';

export default function(input, options) {
    let strings = {};

    input.forEach(entry => {
        const reference = entry.loc
                        .map(loc => `${loc.path}:${loc.line}`)
                        .join('\n');

        strings[entry.msgid] = {
            msgctxt: entry.msgctxt,
            msgid: entry.msgid,
            msgid_plural: entry.msgid_plural,
            msgstr: entry.msgid_plural ? ['', ''] : '',
            comments: {reference}
        };
    });

    return gettextParser.po.compile(Object.assign({
        translations: {
            "": strings
        }
    }, options));
}