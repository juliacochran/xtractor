const tests = [
    'basic',
    'edgecases',
    'jsx',
    'pluralization',
    'templateLiterals',
    'withContext',
    'glob',
    'nunjucksjs'
];

tests.forEach(test => require(`./${test}/test.js`));
