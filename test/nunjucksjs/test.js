var assert = require('chai').assert;
var extractFromFile = require('../../lib/').extractFromFile;

var FIXTURE_PATH = __dirname + '/fixture.nunjucksjs';

describe('xtractor.extractFromFile() -- nunjucksjs', function() {

    it('parses precompiled nunjucks properly', function(done) {
        extractFromFile(FIXTURE_PATH, null, function(err, output) {
            assert.ifError(err);

            var expectedOutput = [
                {
                    msgid: "<span class='value'>{{ formatted_count }}</span> <span class='label'>board</span>",
                    msgid_plural: "<span class='value'>{{ formatted_count }}</span> <span class='label'>boards</span>",
                    loc: [{
                        path: 'templates/macros/format.nunjucks',
                        line: 11
                    }]
                },
                {
                    msgid: "<span class='value'>{{ formatted_count }}</span> <span class='label'>Board</span>",
                    msgid_plural: "<span class='value'>{{ formatted_count }}</span> <span class='label'>Boards</span>",
                    loc: [{
                        path: 'templates/macros/format.nunjucks',
                        line: 3
                    }]
                }
            ];

            assert.sameDeepMembers(output, expectedOutput, 'Output structure');
            done();
        });
    });
});
