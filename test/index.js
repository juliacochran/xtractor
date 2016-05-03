var assert = require('assert');
var extractFromFile = require('../lib/').extractFromFile;

describe('xtractor', function() {
    beforeEach(function() {

    });

    it('passes', function() {
        var output = extractFromFile(__dirname + '/sample/test1.js', ['_', 'i18n._']);
        var expectedOutput = [
            {
                msgid: 'String 1',
                loc: {
                    path: __dirname + '/sample/test1.js',
                    line: 5
                }
            },
            {
                msgid: 'String 2 Multiline',
                loc: {
                    path: __dirname + '/sample/test1.js',
                    line: 6
                }
            },
            {
                msgid: 'String 3',
                loc: {
                    path: __dirname + '/sample/test1.js',
                    line: 8
                }
            },
            {
                msgid: 'String 4',
                loc: {
                    path: __dirname + '/sample/test1.js',
                    line: 9
                }
            },
            {
                msgid: 'String 5 Line 2 Line 3',
                loc: {
                    path: __dirname + '/sample/test1.js',
                    line: 10
                }
            }
        ];
        // assert.deepStrictEqual(output, expectedOutput, 'Output structure');
        assert.deepStrictEqual(output[0], expectedOutput[0], 'Normal call');
        assert.deepStrictEqual(output[1], expectedOutput[1], 'Normal call, multiline');
        assert.deepStrictEqual(output[2], expectedOutput[2], 'JSX child');
        assert.deepStrictEqual(output[3], expectedOutput[3], 'JSX attribute');
    });
});