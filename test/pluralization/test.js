var assert = require('chai').assert;
var extractFromFile = require('../../lib/').extractFromFile;

describe('xtractor.extractFromFile() -- pluralization', function() {

    it('handles pluralized strings', function(done) {
        extractFromFile(__dirname + '/fixture.js', ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);
            var expectedOutput = [
                {
                    msgid: '{{ count }} pin',
                    msgid_plural: '{{ count }} pins',
                    loc: [{
                        path: __dirname + '/fixture.js',
                        line: 1
                    }]
                }
            ];
            assert.sameDeepMembers(output, expectedOutput, 'Output structure');
            done();
        });
    });
});
