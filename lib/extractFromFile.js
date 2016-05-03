'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (filepath, markers) {
    var source = _fs2.default.readFileSync(filepath, 'utf-8');
    var ast = (0, _babylon.parse)(source, {
        sourceType: 'module',
        plugins: ['jsx', 'flow', 'asyncFunctions', 'classConstructorCall', 'doExpressions', 'trailingFunctionCommas', 'objectRestSpread', 'decorators', 'classProperties', 'exportExtensions', 'exponentiationOperator', 'asyncGenerators', 'functionBind', 'functionSent']
    });
    var output = [];

    (0, _babelTraverse2.default)(ast, {
        CallExpression: function CallExpression(path) {
            var node = path.node;
            var _node$callee = node.callee;
            var name = _node$callee.name;
            var type = _node$callee.type;


            if (type === 'Identifier' && markers.indexOf(name) !== -1 || matchesMarkers(path.get('callee'), markers)) {
                output.push({
                    msgid: extractString(node.arguments[0]),
                    loc: {
                        path: filepath,
                        line: node.loc.start.line
                    }
                });
            }
        }
    });

    return output;
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _babylon = require('babylon');

var _babelTraverse = require('babel-traverse');

var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function matchesMarkers(callee, markers) {
    return markers.map(function (marker) {
        return callee.matchesPattern(marker);
    }).reduce(function (prev, curr) {
        return prev || curr;
    }, false);
}

// adapted from https://github.com/oliviertassinari/i18n-extract/blob/master/src/extractFromCode.js
function extractString(node) {
    if (node.type === 'StringLiteral') {
        return node.value;
    } else if (node.type === 'BinaryExpression' && node.operator === '+') {
        return extractString(node.left) + extractString(node.right);
    }
    // else if (node.type === 'TemplateLiteral') {
    //     return node.quasis.reduce((key, quasi) => {
    //         const cooked = quasi.value.cooked;
    //
    //         if (key !== '' && cooked !== '') {
    //             return `${key}*${cooked}`;
    //         }
    //
    //         return key + cooked;
    //     }, '');
    // }
    else if (node.type === 'CallExpression' || node.type === 'Identifier') {
            return null; // We can't extract anything.
        } else {
                // console.warn(`Unsupported node: ${node.type}`);
                return null;
            }
}