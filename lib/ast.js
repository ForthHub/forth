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

function postpone (index) {
    return {
        type: Syntax.ExpressionStatement,
        expression: {
            type: Syntax.CallExpression,
            callee: {
                type: Syntax.MemberExpression,
                computed: false,
                object: {
                    type: Syntax.MemberExpression,
                    computed: false,
                    object: {
                        type: Syntax.ThisExpression
                    },
                    property: {
                        type: Syntax.Identifier,
                        name: 'pos'
                    }
                },
                property: {
                    type: Syntax.Identifier,
                    name: 'push'
                }
            },
            arguments: [
                {
                    type: Syntax.ObjectExpression,
                    properties: [
                        {
                            type: Syntax.Property,
                            key: {
                                type: Syntax.Literal,
                                value: 'type',
                                raw: 'type'
                            },
                            computed: false,
                            value: {
                                type: Syntax.Literal,
                                value: 'ExpressionStatement',
                                raw: 'ExpressionStatement'
                            },
                            kind: 'init',
                            method: false,
                            shorthand: false
                        },
                        {
                            type: Syntax.Property,
                            key: {
                                type: Syntax.Literal,
                                value: 'expression',
                                raw: 'expression'
                            },
                            computed: false,
                            value: {
                                type: Syntax.ObjectExpression,
                                properties: [
                                    {
                                        type: Syntax.Property,
                                        key: {
                                            type: Syntax.Literal,
                                            value: 'type',
                                            raw: 'type'
                                        },
                                        computed: false,
                                        value: {
                                            type: Syntax.Literal,
                                            value: 'CallExpression',
                                            raw: 'CallExpression'
                                        },
                                        kind: 'init',
                                        method: false,
                                        shorthand: false
                                    },
                                    {
                                        type: Syntax.Property,
                                        key: {
                                            type: Syntax.Literal,
                                            value: 'callee',
                                            raw: 'callee'
                                        },
                                        computed: false,
                                        value: {
                                            type: Syntax.ObjectExpression,
                                            properties: [
                                                {
                                                    type: Syntax.Property,
                                                    key: {
                                                        type: Syntax.Literal,
                                                        value: 'type',
                                                        raw: 'type'
                                                    },
                                                    computed: false,
                                                    value: {
                                                        type: Syntax.Literal,
                                                        value: 'MemberExpression',
                                                        raw: 'MemberExpression'
                                                    },
                                                    kind: 'init',
                                                    method: false,
                                                    shorthand: false
                                                },
                                                {
                                                    type: Syntax.Property,
                                                    key: {
                                                        type: Syntax.Literal,
                                                        value: 'computed',
                                                        raw: 'computed'
                                                    },
                                                    computed: false,
                                                    value: {
                                                        type: Syntax.Literal,
                                                        value: true,
                                                        raw: true
                                                    },
                                                    kind: 'init',
                                                    method: false,
                                                    shorthand: false
                                                },
                                                {
                                                    type: Syntax.Property,
                                                    key: {
                                                        type: Syntax.Literal,
                                                        value: 'object',
                                                        raw: 'object'
                                                    },
                                                    computed: false,
                                                    value: {
                                                        type: Syntax.ObjectExpression,
                                                        properties: [
                                                            {
                                                                type: Syntax.Property,
                                                                key: {
                                                                    type: Syntax.Literal,
                                                                    value: 'type',
                                                                    raw: 'type'
                                                                },
                                                                computed: false,
                                                                value: {
                                                                    type: Syntax.Literal,
                                                                    value: 'ThisExpression',
                                                                    raw: 'ThisExpression'
                                                                },
                                                                kind: 'init',
                                                                method: false,
                                                                shorthand: false
                                                            }
                                                        ]
                                                    },
                                                    kind: 'init',
                                                    method: false,
                                                    shorthand: false
                                                },
                                                {
                                                    type: Syntax.Property,
                                                    key: {
                                                        type: Syntax.Literal,
                                                        value: 'property',
                                                        raw: 'property'
                                                    },
                                                    computed: false,
                                                    value: {
                                                        type: Syntax.ObjectExpression,
                                                        properties: [
                                                            {
                                                                type: Syntax.Property,
                                                                key: {
                                                                    type: Syntax.Literal,
                                                                    value: 'type',
                                                                    raw: 'type'
                                                                },
                                                                computed: false,
                                                                value: {
                                                                    type: Syntax.Literal,
                                                                    value: 'Literal',
                                                                    raw: 'Literal'
                                                                },
                                                                kind: 'init',
                                                                method: false,
                                                                shorthand: false
                                                            },
                                                            {
                                                                type: Syntax.Property,
                                                                key: {
                                                                    type: Syntax.Literal,
                                                                    value: 'value',
                                                                    raw: 'value'
                                                                },
                                                                computed: false,
                                                                value: {
                                                                    type: Syntax.Literal,
                                                                    value: index,
                                                                    raw: index + ''
                                                                },
                                                                kind: 'init',
                                                                method: false,
                                                                shorthand: false
                                                            },
                                                            {
                                                                type: Syntax.Property,
                                                                key: {
                                                                    type: Syntax.Literal,
                                                                    value: 'raw',
                                                                    raw: 'raw'
                                                                },
                                                                computed: false,
                                                                value: {
                                                                    type: Syntax.Literal,
                                                                    value: index,
                                                                    raw: index + ''
                                                                },
                                                                kind: 'init',
                                                                method: false,
                                                                shorthand: false
                                                            }
                                                        ]
                                                    },
                                                    kind: 'init',
                                                    method: false,
                                                    shorthand: false
                                                }
                                            ]
                                        },
                                        kind: 'init',
                                        method: false,
                                        shorthand: false
                                    },
                                    {
                                        type: Syntax.Property,
                                        key: {
                                            type: Syntax.Literal,
                                            value: 'arguments',
                                            raw: 'arguments'
                                        },
                                        computed: false,
                                        value: {
                                            type: Syntax.ArrayExpression,
                                            elements: []
                                        },
                                        kind: 'init',
                                        method: false,
                                        shorthand: false
                                    }
                                ]
                            },
                            kind: 'init',
                            method: false,
                            shorthand: false
                        }
                    ]
                }
            ]
        }
    };
}

module.exports = {
    dpush: dpush,
    dpop: dpop,
    rpush: rpush,
    rpop: rpop,
    notdpop: notdpop,
    callword: callword,
    postpone: postpone,
    program: program
};
