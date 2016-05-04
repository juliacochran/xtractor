var assert = require('chai').assert;
var extractFromFile = require('../../lib/').extractFromFile;

describe('xtractor.extractFromFile() -- templateLiterals', function() {

    it('template literals are ignored without exceptions', function(done) {
        extractFromFile(__dirname + '/fixture.js', ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);

            var expectedOutput = [];
            assert.sameDeepMembers(output, expectedOutput, 'Output structure');
            done();
        });
    });
});