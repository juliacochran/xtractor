var assert = require('chai').assert;
var extractGlob = require('../../lib/').extractGlob;

describe('xtractor.extractGlob()', function() {

    it('extract all js files', function(done) {
        extractGlob(__dirname + '/fixtures/*.js', ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);

            assert(output.length === 4);
            done();
        });
    });

    it('glob ignore options', function(done) {
        extractGlob({
            glob: __dirname + '/fixtures/*.js',
            ignorePattern: /fixture-duplicate\.js/
        }, ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);
            assert(output.length === 3);
            done();
        });
    });

    it('dedupes strings across multiple files', function(done) {
        extractGlob(__dirname + '/fixtures/*.js', ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);

            const string1 = output.filter(string => string.msgid === 'String 1');
            assert(string1.length === 1);
            assert(string1[0].loc.length === 2);

            done();
        });
    });
});

describe('xtractor.extractGlob() -- withContext', function() {
    beforeEach(function() {});

    it('extract duplicates across files with context', function(done) {
        extractGlob(__dirname + '/../withContext/*.js', ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);

            assert(output.length === 6);
            done();
        });
    });
});