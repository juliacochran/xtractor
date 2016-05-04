var assert = require('chai').assert;
var extractFromFile = require('../../lib/').extractFromFile;
var buildOutput = require('../buildOutput');

var FIXTURE_PATH = __dirname + '/fixture.js';
var DUPLICATE_PATH = __dirname + '/fixture-duplicate.js';

describe('xtractor.extractFromFile() -- withContext', function() {
    it('handles context uniqueness', function(done) {
        extractFromFile(FIXTURE_PATH, ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);

            var expectedOutput = buildOutput(FIXTURE_PATH, {
                'String 1': [1],
                'String 2 Multiline:String 2 context': [2],
                'String 5 Line 2 Line 3': [4],
                'String 1:This is a special string 1': [7]
            });

            assert.sameDeepMembers(output, expectedOutput, 'Output structure');
            done();
        });
    });

    it('handles context with duplicates', function(done) {
        extractFromFile(DUPLICATE_PATH, ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);

            var expectedOutput = buildOutput(DUPLICATE_PATH, {
                'String 1:This is a special string 1': [9],
                'String 1': [1, 7],
                'String 2 Multiline': [2],
                'String 5 Line 2 Line 3:Special context': [4, 8]
            });

            assert.equal(output.length, expectedOutput.length);
            output.sort((a,b) => a.msgid.localeCompare(b.msgid));
            expectedOutput.sort((a,b) => a.msgid.localeCompare(b.msgid));

            for (var i=0; i < output.length; i++) {
                assert.sameDeepMembers(output[i].loc, expectedOutput[i].loc);
            }
            done();
        });
    });
});