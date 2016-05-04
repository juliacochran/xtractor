var assert = require('chai').assert;
var extractFromFile = require('../../lib/').extractFromFile;
var buildOutput = require('../buildOutput');

var FIXTURE_PATH = __dirname + '/fixture.js';
var DUPLICATE_PATH = __dirname + '/fixture-duplicate.js'

describe('xtractor.extractFromFile() -- basic', function() {
    beforeEach(function() {});

    it('normal and multiline string extraction', function(done) {
        extractFromFile(FIXTURE_PATH, ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);

            var expectedOutput = buildOutput(FIXTURE_PATH, {
                'String 1': [1],
                'String 2 Multiline': [2],
                'String 5 Line 2 Line 3': [4]
            });

            assert.sameDeepMembers(output, expectedOutput, 'Output structure');
            done();
        });
    });

    it('duplicate strings in a single file', function(done) {
        extractFromFile(DUPLICATE_PATH, ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);

            var expectedOutput = buildOutput(DUPLICATE_PATH, {
                'String 1': [1, 7],
                'String 2 Multiline': [2],
                'String 5 Line 2 Line 3': [4, 8]
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

    it('callback with error', function(done) {
        extractFromFile(__dirname + '/doesnotexist.js', ['_', 'i18n._'], function(err) {
            assert.ok(err, 'should throw an error');
            done();
        });
    });

    it('promise interface', function(done) {
        extractFromFile(FIXTURE_PATH, ['_', 'i18n._'])
        .then(function(output) {

            var expectedOutput = buildOutput(FIXTURE_PATH, {
                'String 1': [1],
                'String 2 Multiline': [2],
                'String 5 Line 2 Line 3': [4]
            });

            assert.sameDeepMembers(output, expectedOutput, 'Output structure');
            done();
        });
    });

    it('promise rejection with error', function(done) {
        extractFromFile(__dirname + '/doesnotexist.js', ['_', 'i18n._'])
        .then(function() {
            assert(false, 'Should not run .then() callback');
            done();
        })
        .catch(function(err) {
            assert.ok(err, 'should throw an error');
            done();
        });
    });

});
