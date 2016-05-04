import fs from 'fs';
import {parse} from 'babylon';
import traverse from 'babel-traverse';
import DedupMerger from './DedupMerger';

function matchesMarkers(callee, markers) {
    return markers
        .map(marker => callee.matchesPattern(marker))
        .reduce((prev, curr) => prev || curr, false);
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

function parseAndExtract(source, filepath, markers) {
    // construct act using babylon, with all plugins enabled
    const ast = parse(source, {
        sourceType: 'module',
        plugins: [
            'jsx',
            'flow',
            'asyncFunctions',
            'classConstructorCall',
            'doExpressions',
            'trailingFunctionCommas',
            'objectRestSpread',
            'decorators',
            'classProperties',
            'exportExtensions',
            'exponentiationOperator',
            'asyncGenerators',
            'functionBind',
            'functionSent'
        ]
    });

    const merger = new DedupMerger();

    // traverse the AST
    traverse(ast, {
        CallExpression(path) {
            const {node} = path;
            const {callee: {name, type}} = node;

            if ((type === 'Identifier' && markers.indexOf(name) !== -1) || matchesMarkers(path.get('callee'), markers)) {
                let msgid, msgctxt;

                //TODO: handle unexpected args
                if (node.arguments.length === 1) {
                    // singular only, no context
                    msgid = extractString(node.arguments[0]);
                } else if (node.arguments.length === 2) {
                    // singular, with context
                    msgid = extractString(node.arguments[0]);
                    msgctxt = extractString(node.arguments[1]);
                } else if (node.arguments.length === 3) {
                    // plural, no context
                    msgid = [
                        extractString(node.arguments[0]),
                        extractString(node.arguments[1])
                    ];
                } else if (node.arguments.length === 4){
                    // plural, with context
                    msgid = [
                        extractString(node.arguments[0]),
                        extractString(node.arguments[1])
                    ];
                    msgctxt = extractString(node.arguments[3])
                }
                if (msgid) {
                    // construct the entry first
                    const entryToAdd = {
                        msgid,
                        loc: [{
                            path: filepath,
                            line: node.loc.start.line
                        }]
                    };
                    if (msgctxt) {
                        entryToAdd.msgctxt = msgctxt;
                    }

                    merger.merge([entryToAdd]);

                    // // check if we've seen the string before
                    // if (stringsSeen[[msgid, msgctxt]]) {
                    //     // just update the loc array if we have
                    //     stringsSeen[[msgid, msgctxt]].loc.push({
                    //         path: filepath,
                    //         line: node.loc.start.line
                    //     });
                    // } else {
                    //     // create a new entry and add it to the output
                    //     const msgEntry = {
                    //         msgid,
                    //         loc: [{
                    //             path: filepath,
                    //             line: node.loc.start.line
                    //         }]
                    //     };
                    //     if (msgctxt) {
                    //         msgEntry.msgctxt = msgctxt;
                    //     }
                    //     stringsSeen[[msgid, msgctxt]] = msgEntry;
                    //     output.push(msgEntry);
                    // }
                }
            }
        }
    });

    return merger.getOutput();
}

export default function(filepath, markers, callback) {
    callback = callback || function() {};
    return new Promise(function(resolve, reject) {
        fs.readFile(filepath, 'utf-8', function(err, source) {
            if (err) {
                reject(err);
                callback(err);
                return;
            }
            const extractedStrings = parseAndExtract(source, filepath, markers);
            resolve(extractedStrings);
            callback(null, extractedStrings);
        });
    });
}