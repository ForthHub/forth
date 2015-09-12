'use strict';

var parse = require('esprima').parse,
    replace = require('estraverse').replace,
    generate = require('escodegen').generate

function fix (fn, cxt) {
    var changes = 0;
    var ast = parse('fn = ' + fn.toString());

    replace(ast, {
        leave: function (node) {
            var index;
            if (
                node.type === 'CallExpression' &&
                node.callee.type === 'Literal'
            ) {
                index = cxt.O[node.callee.value].index;
                changes++;
                return {
                    type: 'CallExpression',
                    callee: {
                        type: 'MemberExpression',
                        computed: true,
                        object: {
                            type: 'ThisExpression'
                        },
                        property: {
                            type: 'Literal',
                            value: index,
                            raw: (index + '')
                        }
                    },
                    arguments: []
                };
            }

            if (
                node.type === 'ExpressionStatement' &&
                node.expression.type === 'UpdateExpression'
            ) {
                this.remove();
            }

        }
    });
    if (changes) {
        eval(generate(ast));
    }
    return fn;
}

function def (name, fn, cxt) {
    var index = cxt.L.length;
    cxt.L.push({name: name});
    cxt.O[name] = {index: index};
    cxt[index] = fix(fn, cxt);;
}

module.exports = def;
