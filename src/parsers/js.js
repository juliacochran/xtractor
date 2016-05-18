import {parse} from 'babylon';
import traverse from 'babel-traverse';

function matchesMarkers(callee, markers) {
    return markers
        .map(marker => callee.matchesPattern(marker))
        .reduce((prev, curr) => prev || curr, false);
}

function createPlaceholderString(templateLiteral) {
    if (templateLiteral.expressions.length || templateLiteral.quasis.length > 1) {
        // the template string is interpolated - so we do not support it
        // console.warn('Unsupported interpolated template string');
        return null;
    }
    return templateLiteral.quasis[0].value.cooked;
}

// adapted from https://github.com/oliviertassinari/i18n-extract/blob/master/src/extractFromCode.js
function extractString(node) {
    if (node.type === 'StringLiteral') {
        return node.value;
    } else if (node.type === 'BinaryExpression' && node.operator === '+') {
        return extractString(node.left) + extractString(node.right);
    } else if (node.type ==='TemplateLiteral') {
        return createPlaceholderString(node);
    } else if (node.type ==='TaggedTemplateExpression') {
        return createPlaceholderString(node.quasi);
    } else if (node.type === 'CallExpression' || node.type === 'Identifier') {
        return null; // We can't extract anything.
    } else {
        // console.warn(`Unsupported node: ${node.type}`);
        return null;
    }
}

export default function parseAndExtract(source, filepath, markers, store) {
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

    // traverse the AST
    traverse(ast, {
        CallExpression(path) {
            const {node} = path;
            const {callee: {name, type}} = node;

            if ((type === 'Identifier' && markers.indexOf(name) !== -1) || matchesMarkers(path.get('callee'), markers)) {
                let msgid, msgctxt, msgid_plural;

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
                    msgid = extractString(node.arguments[0]);
                    msgid_plural = extractString(node.arguments[1]);
                } else if (node.arguments.length === 4){
                    // plural, with context
                    msgid = extractString(node.arguments[0]);
                    msgid_plural = extractString(node.arguments[1]);
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
                    if (msgid_plural) {
                        entryToAdd.msgid_plural = msgid_plural;
                    }
                    if (msgctxt) {
                        entryToAdd.msgctxt = msgctxt;
                    }

                    store.add(entryToAdd);
                }
            }
        }
    });
}