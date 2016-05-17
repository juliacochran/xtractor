var assert = require('chai').assert;
var writePo = require('../../lib/').writePo;

describe('xtractor.writePo() -- pluralization', function() {

    it('correctly compiles po', function() {
        var input = [
            {
                msgid: '{{ count }} pin',
                msgid_plural: '{{ count }} pins',
                loc: [{
                    path: __dirname + '/fixture.js',
                    line: 1
                }]
            },
            {
                msgid: 'Test string',
                loc: [
                    {
                        path: __dirname + '/fixture.js',
                        line: 3
                    },
                    {
                        path: __dirname + '/otherfile.js',
                        line: 5
                    }
                ]
            },
            {
                msgid: 'Safe mode alert!',
                loc: [
                    {
                        path: __dirname + '/fixture.js',
                        line: 10
                    }
                ]
            },
            {
                msgid: 'Safe mode alert!',
                msgctxt: 'settings',
                loc: [
                    {
                        path: __dirname + '/fixture.js',
                        line: 13
                    }
                ]
            }
        ];

        var expectedOutput = `msgid ""
msgstr ""
"Plural-Forms: nplurals=2; plural=(n != 1);\\n"
"Content-Type: text/plain; charset=utf-8\\n"
"Content-Transfer-Encoding: 8bit\\n"

#: ${__dirname}/fixture.js:1
msgid "{{ count }} pin"
msgid_plural "{{ count }} pins"
msgstr[0] ""
msgstr[1] ""

#: ${__dirname}/fixture.js:3
#: ${__dirname}/otherfile.js:5
msgid "Test string"
msgstr ""

#: ${__dirname}/fixture.js:10
msgid "Safe mode alert!"
msgstr ""

#: ${__dirname}/fixture.js:13
msgctxt "settings"
msgid "Safe mode alert!"
msgstr ""`;

        var output = writePo(input, {
            charset: 'utf-8',
            headers: {
                "plural-forms": "nplurals=2; plural=(n != 1);\n",
                "content-type": "text/plain; charset=utf-8\n",
                "content-transfer-encoding": "8bit\n"
            }
        });

        assert.equal(output.toString('utf-8'), expectedOutput);
    });
});