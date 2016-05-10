const tests = [
    'basic',
    'edgecases',
    'jsx',
    'pluralization',
    'templateLiterals',
    'withContext',
    'glob',
    'nunjucksjs',
    'po'
];

tests.forEach(test => require(`./${test}/test.js`));
