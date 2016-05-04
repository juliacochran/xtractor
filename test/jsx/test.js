var assert = require('chai').assert;
var extractFromFile = require('../../lib/').extractFromFile;
var buildOutput = require('../buildOutput');

var FIXTURE_PATH = __dirname + '/fixture.js';

describe('xtractor.extractFromFile() -- jsx', function() {

    it('parses JSX attributes and children correctly', function(done) {
        extractFromFile(FIXTURE_PATH, ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);

            var expectedOutput = buildOutput(FIXTURE_PATH, {
                'String 3': [2],
                'String 4': [3]
            });

            assert.sameDeepMembers(output, expectedOutput, 'Output structure');
            done();
        });
    });
});
