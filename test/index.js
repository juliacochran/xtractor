const tests = [
    'basic',
    'edgecases',
    'jsx',
    'pluralization',
    'templateLiterals',
    'withContext',
    'glob'
];

tests.forEach(test => require(`./${test}/test.js`));
