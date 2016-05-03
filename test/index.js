var assert = require('assert');
var extractFromFile = require('../lib/').extractFromFile;
var extractGlob = require('../lib/').extractGlob;

describe('xtractor.extractFromFile()', function() {
    beforeEach(function() {});

    it('normal and multiline string extraction', function(done) {
        extractFromFile(__dirname + '/sample/normal.js', ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);
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
            done();
        });
    });

    it('parses JSX attributes and children correctly', function(done) {
        extractFromFile(__dirname + '/sample/jsx.js', ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);
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
            done();
        });
    });

    it('template literals are ignored without exceptions', function(done) {
        extractFromFile(__dirname + '/sample/templateLiterals.js', ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);

            var expectedOutput = [];
            assert.deepStrictEqual(output, expectedOutput, 'Output structure');
            done();
        });
    });

    it('callback with error', function(done) {
        extractFromFile(__dirname + '/sample/doesnotexist.js', ['_', 'i18n._'], function(err) {
            assert.ok(err, 'should throw an error');
            done();
        });
    });

    it('promise interface', function(done) {
        extractFromFile(__dirname + '/sample/normal.js', ['_', 'i18n._'])
        .then(function(output) {
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
            done();
        });
    });

    it('promise rejection with error', function(done) {
        extractFromFile(__dirname + '/sample/doesnotexist.js', ['_', 'i18n._'])
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

describe('xtractor.extractGlob()', function() {
    beforeEach(function() {});

    it('extract all js files', function(done) {
        extractGlob(__dirname + '/sample/*.js', ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);

            assert(output.length === 5);
            done();
        });
    });

    it('extract some js files using glob', function(done) {
        extractGlob(__dirname + '/sample/!(jsx).js', ['_', 'i18n._'], function(err, output) {
            assert.ifError(err);

            assert(output.length === 3);
            done();
        });
    });
});