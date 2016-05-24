import gettextParser from 'gettext-parser';

export default function(input) {
    const translations = gettextParser.po.parse(input).translations;
    delete translations[''][''];

    for (let context in translations) {
        for (let msgid in translations[context]) {
            var msgstr = translations[context][msgid].msgstr;
            if (msgstr.length === 1) {
                translations[context][msgid] = msgstr[0];
            } else {
                translations[context][msgid] = msgstr;
            }
        }
    }
    return translations;
}