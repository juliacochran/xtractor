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
        if (entry.ctxtForTranslator) {
            if (!translationObj['translations'][entry.ctxtForTranslator]) {
                translationObj['translations'][entry.ctxtForTranslator ] = {};
            }
            contextObj = translationObj['translations'][entry.ctxtForTranslator];
        } else {
            contextObj = translationObj['translations'][''];
        }

        contextObj[entry.msgid] = {
            msgctxt: '',
            msgid: entry.msgid,
            msgid_plural: entry.msgid_plural,
            msgstr: entry.msgid_plural ? ['', ''] : '',
            comments: {
                translator: entry.ctxtForTranslator,
                reference
            }
        };
    });

    return gettextParser.po.compile(Object.assign({}, translationObj, options));
}
