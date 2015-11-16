'use strict';

var estraverse = require('estraverse');

var Syntax = estraverse.Syntax;

function signedLiteral (num) {
    var val = Number(num);
    if (val < 0) {
        return {
            type: Syntax.UnaryExpression,
            operator: '-',
            argument: {
                type: Syntax.Literal,
                value: -val,
                raw: -val + ''
            },
            prefix: true
        };
    }
    return {
        type: Syntax.Literal,
        value: val,
        raw: val + ''
    };
}

function rpush (a) {
    return {
        type: Syntax.ExpressionStatement,
        expression: {
            type: Syntax.CallExpression,
            callee: {
                type: Syntax.MemberExpression,
                computed: false,
                object: {
                    type: Syntax.ThisExpression
                },
                property: {
                    type: Syntax.Identifier,
                    name: 'rpush'
                }
            },
            arguments: a
        }
    };
}

function dpush (e) {
    return {
        type: Syntax.ExpressionStatement,
        expression: {
            type: Syntax.CallExpression,
            callee: {
                type: Syntax.MemberExpression,
                computed: false,
                object: {
                    type: Syntax.ThisExpression
                },
                property: {
                    type: Syntax.Identifier,
                    name: 'dpush'
                }
            },
            arguments: [
                signedLiteral(e)
            ]
        }
    };
}

function dpop () {
    return {
        type: Syntax.CallExpression,
        callee: {
            type: Syntax.MemberExpression,
            computed: false,
            object: {
                type: Syntax.ThisExpression
            },
            property: {
                type: Syntax.Identifier,
                name: 'dpop'
            }
        },
        arguments: []
    };
}

function rpop () {
    return {
        type: Syntax.CallExpression,
        callee: {
            type: Syntax.MemberExpression,
            computed: false,
            object: {
                type: Syntax.ThisExpression
            },
            property: {
                type: Syntax.Identifier,
                name: 'rpop'
            }
        },
        arguments: []
    };
}

function notdpop () {
    return {
        type: Syntax.UnaryExpression,
        operator: '!',
        argument: dpop(),
        prefix: true
    };
}

function callword (e) {
    return {
        type: Syntax.ExpressionStatement,
        expression: {
            type: Syntax.CallExpression,
            callee: {
                type: Syntax.MemberExpression,
                computed: true,
                object: {
                    type: Syntax.ThisExpression
                },
                property: {
                    type: Syntax.Literal,
                    value: e,
                    raw: e + ''
                }
            },
            arguments: []
        }
    };
}

function program (body) {
    return {
        type: 'Program',
        body: [
            {
                type: Syntax.ExpressionStatement,
                expression: {
                    type: Syntax.AssignmentExpression,
                    operator: '=',
                    left: {
                        type: Syntax.Identifier,
                        name: 'fn'
                    },
                    right: {
                        type: Syntax.FunctionExpression,
                        id: null,
                        params: [],
                        defaults: [],
                        body: {
                            type: Syntax.BlockStatement,
                            body: body
                        },
                        generator: false,
                        expression: false
                    }
                }
            }
        ],
        sourceType: 'script'
    };
}

module.exports = {
    dpush: dpush,
    dpop: dpop,
    rpush: rpush,
    rpop: rpop,
    notdpop: notdpop,
    callword: callword,
    program: program
};
