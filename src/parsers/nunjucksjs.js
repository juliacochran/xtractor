import {parse} from 'babylon';
import traverse from 'babel-traverse';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

export default function parseAndExtract(source, filepath, markers, store) {
    // construct act using babylon, with all plugins enabled
    const ast = parse(source, {
        sourceType: 'module',
        allowReturnOutsideFunction: true
    });

    let currentFile;

    traverse(ast, {
        MemberExpression: function(path) {
            if (path.node.object.type === 'AssignmentExpression' && path.node.object.left.object.name === 'window' && path.node.object.left.property.name === 'nunjucksPrecompiled') {
                currentFile = path.node.property.value;
                if (argv.verbose) {
                    console.log(currentFile);
                }
            }
        },
        CallExpression: function(path) {
            if (path.node.callee.type === 'MemberExpression' && path.node.callee.object.name === 'runtime' && path.node.callee.property.name === 'callWrap') {
                // make sure we are in a gettext or translation function
                if (path.node.arguments[1]) {
                    const lineno = path.parent.expressions[0].right.value;
                    let msgid, ctxtForTranslator, msgid_plural;
                    if (path.node.arguments[1].value === '_') {
                        // singular case
                        msgid = path.node.arguments[2].elements[0].value;
                        if (path.node.arguments[2].elements[1] && path.node.arguments[2].elements[1].type === 'StringLiteral') {
                            ctxtForTranslator = path.node.arguments[2].elements[1].value;
                        }
                    } else if (path.node.arguments[1].value === 'ngettext') {
                        // plural case
                        msgid = path.node.arguments[2].elements[0].value;
                        msgid_plural = path.node.arguments[2].elements[1].value;
                        if (path.node.arguments[2].elements[2] && path.node.arguments[2].elements[2].type === 'StringLiteral') {
                            ctxtForTranslator = path.node.arguments[2].elements[2].value;
                        }
                    } else {
                        return;
                    }

                    const entryToAdd = {
                        msgid,
                        loc: [{
                            path: currentFile,
                            line: lineno
                        }]
                    };
                    if (msgid_plural) {
                        entryToAdd.msgid_plural = msgid_plural;
                    }
                    if (ctxtForTranslator) {
                        entryToAdd.ctxtForTranslator = ctxtForTranslator;
                    }

                    store.add(entryToAdd);
                }
            }
        }
    });
}