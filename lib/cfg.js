'use strict';

var def = require('./def'),
    estraverse = require('estraverse');

var Syntax = estraverse.Syntax;

function main (cxt) {

// : : CREATE ] DOES> doLIST ;
    def(':', function () {
        var w = this.io.word('\\s');
        this.state = 1;
        this.cfs = [];
        this.lastw = w;
        this.pos = [];
        this.ast = {
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
                                body: this.pos
                            },
                            generator: false,
                            expression: false
                        }
                    }
                }
            ],
            sourceType: 'script'
        };
    }, cxt);

// : ; next [ ; IMMEDIATE
// : ; POSTPONE EXIT  REVEAL POSTPONE [ ; IMMEDIATE
    def(';', function () {
        this.state = 0;
        def(this.lastw, this.ast, this);
    }, cxt, { immediate: true });

/*
    6.1.1380 EXIT (CORE)

Interpretation: Interpretation semantics for this word are undefined.

Execution: ( -- ) ( R: nest-sys -- )
    Return control to the calling definition specified by nest-sys. Before
    executing EXIT within a do-loop, a program shall discard the loop-control
    parameters by executing UNLOOP.
*/

def('exit', function () {
    this.pos.push({
        type: Syntax.ReturnStatement,
        argument: null
    });
}, cxt, { immediate: true });



/*

    a                   a();
    IF                  if (ds.pop()) {
        b                   b();
    THEN                }
    c                   c();


    a                   a();
    IF                  if (ds.pop()) {
        b                   b();
    ELSE                } else {
        c                   c();
    THEN                }
    d                   d();

*/


/*
    6.1.1700 IF (CORE)

Interpretation: Interpretation semantics for this word are undefined.

Compilation: ( C: -- orig )
    Put the location of a new unresolved forward reference orig onto the control
    flow stack. Append the run-time semantics given below to the current definition.
    The semantics are incomplete until orig is resolved, e.g., by THEN or ELSE.

Run-time: ( x -- )
    If all bits of x are zero, continue execution at the location specified by
    the resolution of orig.
*/
    def('if', function () {
        var oldpos;
        oldpos = this.pos;
        this.cfs.push(oldpos);
        this.pos = [];
        oldpos.push({
            type: Syntax.IfStatement,
            test: {
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
            },
            consequent: {
                type: Syntax.BlockStatement,
                body: this.pos
            },
            alternate: null
        });
    }, cxt, { immediate: true });


/*
    6.1.2270 THEN (CORE)

Interpretation: Interpretation semantics for this word are undefined.

Compilation: ( C: orig -- )
    Append the run-time semantics given below to the current definition. Resolve
    the forward reference orig using the location of the appended run-time semantics.

Run-time: ( -- )
    Continue execution.
*/
    def('then', function () {
        this.pos = this.cfs.pop();
    }, cxt, { immediate: true });


/*
    6.1.1310 ELSE (CORE)

Interpretation: Interpretation semantics for this word are undefined.

Compilation: ( C: orig1 -- orig2 )
    Put the location of a new unresolved forward reference orig2 onto the
    control flow stack. Append the run-time semantics given below to the current
    definition. The semantics will be incomplete until orig2 is resolved
    (e.g., by THEN). Resolve the forward reference orig1 using the location
    following the appended run-time semantics.

Run-time: ( -- )
    Continue execution at the location given by the resolution of orig2.
*/
//  : ELSE ( orig1 -- orig2 / -- )
//      \ resolve IF supplying alternate execution
//      POSTPONE AHEAD  \ unconditional forward branch orig2
//      1 CS-ROLL       \ put orig1 back on top
//      POSTPONE THEN   \ resolve forward branch from orig1
//  ; IMMEDIATE

    def('else', function () {
        var pos = [];
        var oldblock = this.cfs[this.cfs.length - 1];
        oldblock[oldblock.length - 1].alternate = {
            type: Syntax.BlockStatement,
            body: pos
        };
        this.pos = pos;
    }, cxt, { immediate: true });

/*

    a                   a();
    BEGIN               do {
        b                   b();
    AGAIN               } while(true)
    c                   c();


    a                   a();
    BEGIN               do {
        b                   b();
    UNTIL               } while(!ds.pop())
    c                   c();


    a                   a();
    BEGIN               do {
        b                    b();
    WHILE               if (!ds.pop()) { break; }
        c                    c();
    REPEAT              } while(true)
    d                   d();
*/

/*
    6.1.0760 BEGIN (CORE)

Interpretation: Interpretation semantics for this word are undefined.

Compilation: ( C: -- dest )
    Put the next location for a transfer of control, dest, onto the control flow
    stack. Append the run-time semantics given below to the current definition.

Run-time: ( -- )
    Continue execution.
*/
    def('begin', function () {
        var oldpos;
        oldpos = this.pos;
        this.cfs.push(oldpos);
        this.pos = [];
        oldpos.push({
            type: Syntax.DoWhileStatement,
            body: {
                type: Syntax.BlockStatement,
                body: this.pos
            },
            test: {
                type: Syntax.Literal,
                value: true,
                raw: 'true'
            }
        });
    }, cxt, { immediate: true });


/*
    6.1.2390 UNTIL (CORE)

Interpretation: Interpretation semantics for this word are undefined.

Compilation: ( C: dest -- )
    Append the run-time semantics given below to the current definition,
    resolving the backward reference dest.

Run-time: ( x -- )
    If all bits of x are zero, continue execution at the location specified by
    dest.
*/
    def('until', function () {
        this.pos = this.cfs.pop();
        this.pos[this.pos.length - 1].test = {
            type: Syntax.UnaryExpression,
            operator: '!',
            argument: {
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
            },
            prefix: true
        };
    }, cxt, { immediate: true });


/*
    6.1.2430 WHILE (CORE)

Interpretation: Interpretation semantics for this word are undefined.

Compilation: ( C: dest -- orig dest )
    Put the location of a new unresolved forward reference orig onto the
    control flow stack, under the existing dest. Append the run-time semantics
    given below to the current definition. The semantics are incomplete until
    orig and dest are resolved (e.g., by REPEAT).

Run-time: ( x -- )
    If all bits of x are zero, continue execution at the location specified by
    the resolution of orig.
*/

//  : WHILE ( dest -- orig dest / flag -- )
//      \ conditional exit from loops
//      POSTPONE IF     \ conditional forward brach
//      1 CS-ROLL       \ keep dest on top
//  ; IMMEDIATE

    def('while', function () {
        this.pos.push({
            type: Syntax.IfStatement,
            test: {
                type: Syntax.UnaryExpression,
                operator: '!',
                argument: {
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
                },
                prefix: true
            },
            consequent: {
                type: Syntax.BlockStatement,
                body: [
                    {
                        type: Syntax.BreakStatement,
                        label: null
                    }
                ]
            },
            alternate: null
        });
    }, cxt, { immediate: true });

/*
    6.2.0700 AGAIN (CORE EXT)

Interpretation: Interpretation semantics for this word are undefined.

Compilation: ( C: dest -- )
    Append the run-time semantics given below to the current definition,
    resolving the backward reference dest.

Run-time: ( -- )
    Continue execution at the location specified by dest. If no other control
    flow words are used, any program code after AGAIN will not be executed.
*/
    def('again', function () {
        this.pos = this.cfs.pop();
    }, cxt, { immediate: true });

//  : REPEAT ( orig dest -- / -- )
//      \ resolve a single WHILE and return to BEGIN
//      POSTPONE AGAIN  \ uncond. backward branch to dest
//      POSTPONE THEN   \ resolve forward branch from orig
//  ; IMMEDIATE

    def('repeat', function () {
        this.pos = this.cfs.pop();
    }, cxt, { immediate: true });

/*
    15.6.2.0702 AHEAD (TOOLS EXT)

Interpretation: Interpretation semantics for this word are undefined.

Compilation: ( C: -- orig )
    Put the location of a new unresolved forward reference orig onto the
    control flow stack. Append the run-time semantics given below to the current
    definition. The semantics are incomplete until orig is resolved (e.g., by THEN).

Run-time: ( -- )
    Continue execution at the location specified by the resolution of orig.
*/

// : DO POSTPONE 2>R HERE ; IMMEDIATE
    def('do', function () {
    }, cxt, { immediate: true });

    def('loop', function () {
    }, cxt, { immediate: true });


/*

    6.1.2120 RECURSE (CORE)

Interpretation: Interpretation semantics for this word are undefined.

Compilation: ( -- )
    Append the execution semantics of the current definition to the current
    definition. An ambiguous condition exists if RECURSE appears in a definition
    after DOES>.
*/

    def('recurse', function () {
        var index;
        index = this.L.length;
        this.pos.push({
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
                        value: index,
                        raw: index + ''
                    }
                },
                arguments: []
            }
        });
    }, cxt, { immediate: true });

}

module.exports = main;
