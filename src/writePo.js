import gettextParser from 'gettext-parser';

export default function(input, options) {
    let translationObj = {
        translations: {
            '': {}
        }
    };

    input.forEach(entry => {
        const reference = entry.loc
                        .map(loc => `${loc.path}:${loc.line}`)
                        .join('\n');

        let contextObj;
        if (entry.msgctxt) {
            if (!translationObj['translations'][entry.msgctxt]) {
                translationObj['translations'][entry.msgctxt ] = {};
            }
            contextObj = translationObj['translations'][entry.msgctxt];
        } else {
            contextObj = translationObj['translations'][''];
        }

        contextObj[entry.msgid] = {
            msgctxt: entry.msgctxt,
            msgid: entry.msgid,
            msgid_plural: entry.msgid_plural,
            msgstr: entry.msgid_plural ? ['', ''] : '',
            comments: {reference}
        };
    });

    return gettextParser.po.compile(Object.assign({}, translationObj, options));
}