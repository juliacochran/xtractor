var assert = require('chai').assert;
var extractFromFile = require('../../lib/').extractFromFile;

const FIXTURE_PATH = __dirname + '/fixture.js';

describe('xtractor.extractFromFile() -- templateLiterals', function() {

    it('template literals are ignored without exceptions', function(done) {
        extractFromFile(FIXTURE_PATH, ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);

            var expectedOutput = [
                {
                    msgid: 'Template literal 1',
                    loc: [{
                        path: FIXTURE_PATH,
                        line: 2
                    }]
                },
                {
                    msgid: 'Template literal 2',
                    loc: [{
                        path: FIXTURE_PATH,
                        line: 4
                    }]
                },
                {
                    msgid: 'Multiline Template Literal',
                    loc: [{
                        path: FIXTURE_PATH,
                        line: 6
                    }]
                }
            ];
            assert.sameDeepMembers(output, expectedOutput, 'Output structure');
            done();
        });
    });
});