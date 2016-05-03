var assert = require('assert');
var extractFromFile = require('../lib/').extractFromFile;

describe('xtractor', function() {
    beforeEach(function() {});

    it('normal and multiline string extraction', function() {
        var output = extractFromFile(__dirname + '/sample/normal.js', ['_', 'i18n._']);
        var expectedOutput = [
            {
                msgid: 'String 1',
                loc: {
                    path: __dirname + '/sample/normal.js',
                    line: 1
                }
            },
            {
                msgid: 'String 2 Multiline',
                loc: {
                    path: __dirname + '/sample/normal.js',
                    line: 2
                }
            },
            {
                msgid: 'String 5 Line 2 Line 3',
                loc: {
                    path: __dirname + '/sample/normal.js',
                    line: 4
                }
            }
        ];
        assert.deepStrictEqual(output, expectedOutput, 'Output structure');
    });

    it('parses JSX attributes and children correctly', function() {
        var output = extractFromFile(__dirname + '/sample/jsx.js', ['_', 'i18n._']);
        var expectedOutput = [
            {
                msgid: 'String 3',
                loc: {
                    path: __dirname + '/sample/jsx.js',
                    line: 2
                }
            },
            {
                msgid: 'String 4',
                loc: {
                    path: __dirname + '/sample/jsx.js',
                    line: 6
                }
            }
        ];
        assert.deepStrictEqual(output, expectedOutput, 'Output structure');
    });

    it('template literals are ignored without exceptions', function() {
        var output = extractFromFile(__dirname + '/sample/templateLiterals.js', ['_', 'i18n._']);
        var expectedOutput = [];
        assert.deepStrictEqual(output, expectedOutput, 'Output structure');
    });
});