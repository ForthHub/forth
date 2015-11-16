'use strict';

var def = require('./def'),
    // jsof = require('jsof'),
    // generate = require('escodegen').generate,
    ast = require('./ast'),
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
        this.label = 1;
        this.orig = [];
        this.ast = ast.program(this.pos);
    }, cxt);

// : ; next [ ; IMMEDIATE
// : ; POSTPONE EXIT  REVEAL POSTPONE [ ; IMMEDIATE
    def(';', function () {
        this.state = 0;
        def(this.lastw, this.ast, this);
    }, cxt, { immediate: true });

// : [ -1 STATE ! ; IMMEDIATE
    def('[', function () {
        this.state = 0;
    }, cxt, { immediate: true });

// : ] 0 STATE ! ;
    def(']', function () {
        this.state = 1;
    }, cxt);

// 6.1.2250 STATE (CORE)
// ( -- a-addr )
// a-addr is the address of a cell containing the compilation-state flag.
// STATE is true when in compilation state, false otherwise. The true value in
// STATE is non-zero, but is otherwise implementation-defined. Only the
// following standard words alter the value in STATE: : (colon), ; (semicolon),
// ABORT, QUIT, :NONAME, [ (left-bracket), and ] (right-bracket).
// Note: A program shall not directly alter the contents of STATE.

    def('state', function () {
        this.dpush(0); // TODO should be real state memory cell
    }, cxt);


// 6.1.2033 POSTPONE (CORE)

// Interpretation: Interpretation semantics for this word are undefined.

// Compilation: ( “<spaces>name” -- )
//      Skip leading space delimiters. Parse name delimited by a space.
//      Find name. Append the compilation semantics of name to the current
//      definition. An ambiguous condition exists if name is not found.

    def('postpone', function () {
        var w = this.io.word('\\s');
        var wordLink = this.O[w.toLowerCase()];
        if (wordLink) {
           this.pos.push(ast.callword(wordLink.index));
        } else {
            console.log('word: ' + w + ' is not defined');
            throw new Error;
        }
    }, cxt, { immediate: true });


// 6.1.1380 EXIT (CORE)

// Interpretation: Interpretation semantics for this word are undefined.

// Execution: ( -- ) ( R: nest-sys -- )
//      Return control to the calling definition specified by nest-sys.
//      Before executing EXIT within a do-loop, a program shall discard
//      the loop-control parameters by executing UNLOOP.

    def('exit', function () {
        this.pos.push({
            type: Syntax.ReturnStatement,
            argument: null
        });
    }, cxt, { immediate: true });



/*
    if (dpop()) {       // IF
        ;
    }                   // THEN
    ;
    L1: {
        if (dpop()) {   // IF
            ;
            break L1;   // ELSE
        }
        ;
    }                   // THEN
    ;
    L2: do {                    // BEGIN
        ;
    } while(true)               // AGAIN
    ;
    L3: do {                    // BEGIN
        ;
    } while(!dpop())            // UNTIL
    ;
    L5: do {                    // BEGIN
        ;
        if (!dpop) { break L5; }// WHILE
        ;
    } while(true)               // REPEAT
    ;
    L9: {
        L7: {
            L8: do {            // BEGIN
                ;
                if(!dpop) { break L7; } // WHILE
                ;
                if(!dpop) { break L8; } // WHILE
                ;
            } while(true)       // REPEAT
            ;
            break L9;           // ELSE
        }
        ;
    }                           // THEN
    ;
*/


// 6.1.1700 IF (CORE)

// Interpretation: Interpretation semantics for this word are undefined.

// Compilation: ( C: -- orig )
//      Put the location of a new unresolved forward reference orig onto
//      the control flow stack. Append the run-time semantics given below
//      to the current definition. The semantics are incomplete until orig
//      is resolved, e.g., by THEN or ELSE.

// Run-time: ( x -- )
//      If all bits of x are zero, continue execution at the location
//      specified by the resolution of orig.

    def('if', function () {
        var oldpos = this.pos;
        this.cfs.push(oldpos);
        this.orig.push(this.label);

        this.pos = [
            {
                type: Syntax.IfStatement,
                test: ast.notdpop(),
                consequent: {
                    type: Syntax.BreakStatement,
                    label: {
                        type: Syntax.Identifier,
                        name: 'L' + this.label
                    }
                },
                alternate: null
            }
        ];

        oldpos.push({
            type: Syntax.LabeledStatement,
            label: {
                type: Syntax.Identifier,
                name: 'L' + this.label
            },
            body: {
                type: Syntax.BlockStatement,
                body: this.pos
            }
        });

        this.label++;
        // console.log(jsof.s(this.ast, {ansi: true}));
        // console.log(generate(this.ast));
    }, cxt, { immediate: true });

    // def('if', function () {
    //     var oldpos = this.pos;
    //     this.pos = [];
    //     oldpos.push({
    //         type: Syntax.IfStatement,
    //         test: ast.dpop(),
    //         consequent: {
    //             type: Syntax.BlockStatement,
    //             body: this.pos
    //         },
    //         alternate: null
    //     });
    //     this.cfs.push(oldpos);
    // }, cxt, { immediate: true });


// 6.1.2270 THEN (CORE)

// Interpretation: Interpretation semantics for this word are undefined.

// Compilation: ( C: orig -- )
//      Append the run-time semantics given below to the current definition.
//      Resolve the forward reference orig using the location of the appended
//      run-time semantics.

// Run-time: ( -- )
//      Continue execution.

    def('then', function () {
        this.pos = this.cfs.pop();
        this.orig.pop();
        // console.log(jsof.s(this.ast, {ansi: true}));
        // console.log(generate(this.ast));
    }, cxt, { immediate: true });


// 6.1.1310 ELSE (CORE)

// Interpretation: Interpretation semantics for this word are undefined.

// Compilation: ( C: orig1 -- orig2 )
//      Put the location of a new unresolved forward reference orig2 onto
//      the control flow stack. Append the run-time semantics given below
//      to the current definition. The semantics will be incomplete until
//      orig2 is resolved (e.g., by THEN). Resolve the forward reference
//      orig1 using the location following the appended run-time semantics.

// Run-time: ( -- )
//      Continue execution at the location given by the resolution of orig2.

//  : ELSE ( orig1 -- orig2 / -- )
//      \ resolve IF supplying alternate execution
//      POSTPONE AHEAD  \ unconditional forward branch orig2
//      1 CS-ROLL       \ put orig1 back on top
//      POSTPONE THEN   \ resolve forward branch from orig1
//  ; IMMEDIATE

    def('else', function () {
        var newlabel = this.label;
        this.label++;

        this.pos.push({
            type: Syntax.BreakStatement,
            label: {
                type: Syntax.Identifier,
                name: 'L' + newlabel
            }
        });

        var oldlabel = this.orig.pop();
        this.orig.push(newlabel);

        var oldlimbs = this.cfs[this.cfs.length - 1];
        var lastoldlimb = oldlimbs.pop();
        lastoldlimb.label.name = 'L' + oldlabel;

        this.pos = [lastoldlimb];
        oldlimbs.push({
            type: Syntax.LabeledStatement,
            label: {
                type: Syntax.Identifier,
                name: 'L' + newlabel
            },
            body: {
                type: Syntax.BlockStatement,
                body: this.pos
            }
        });
        // console.log(generate(this.ast));
    }, cxt, { immediate: true });


// 6.1.0760 BEGIN (CORE)

// Interpretation: Interpretation semantics for this word are undefined.

// Compilation: ( C: -- dest )
//      Put the next location for a transfer of control, dest, onto the control
//      flow stack. Append the run-time semantics given below to the current
//      definition.

//  Run-time: ( -- )
//      Continue execution.

    def('begin', function () {
        var oldpos;
        oldpos = this.pos;
        this.cfs.push(oldpos);
        this.pos = [];
        oldpos.push({
            type: Syntax.LabeledStatement,
            label: {
                type: Syntax.Identifier,
                name: 'L' // + this.label
            },
            body: {
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
            }
        });
        this.label++;
        // console.log(generate(this.ast));
    }, cxt, { immediate: true });


// 6.1.2390 UNTIL (CORE)

// Interpretation: Interpretation semantics for this word are undefined.

// Compilation: ( C: dest -- )
//      Append the run-time semantics given below to the current definition,
//      resolving the backward reference dest.

// Run-time: ( x -- )
//      If all bits of x are zero, continue execution at the location
//      specified by dest.
    def('until', function () {
        this.pos = this.cfs.pop();
        this.pos[this.pos.length - 1].body.test = ast.notdpop();
        // console.log(generate(this.ast));
    }, cxt, { immediate: true });


// 6.1.2430 WHILE (CORE)

// Interpretation: Interpretation semantics for this word are undefined.

// Compilation: ( C: dest -- orig dest )
//      Put the location of a new unresolved forward reference orig onto the
//      control flow stack, under the existing dest. Append the run-time
//      semantics given below to the current definition. The semantics are
//      incomplete until orig and dest are resolved (e.g., by REPEAT).

// Run-time: ( x -- )
//      If all bits of x are zero, continue execution at the location
//      specified by the resolution of orig.

//  : WHILE ( dest -- orig dest / flag -- )
//      \ conditional exit from loops
//      POSTPONE IF     \ conditional forward brach
//      1 CS-ROLL       \ keep dest on top
//  ; IMMEDIATE

    def('while', function () {
        var oldpos = this.pos;
        this.cfs.push(oldpos);
        this.orig.push(this.label);

        this.pos = [
            {
                type: Syntax.IfStatement,
                test: ast.notdpop(),
                consequent: {
                    type: Syntax.BreakStatement,
                    label: {
                        type: Syntax.Identifier,
                        name: 'L' + this.label
                    }
                },
                alternate: null
            }
        ];

        oldpos.push({
            type: Syntax.LabeledStatement,
            label: {
                type: Syntax.Identifier,
                name: 'L' // + this.label
            },
            body: {
                type: Syntax.BlockStatement,
                body: this.pos
            }
        });

        this.label++;
        // console.log(generate(this.ast));
    }, cxt, { immediate: true });

// 6.2.0700 AGAIN (CORE EXT)

// Interpretation: Interpretation semantics for this word are undefined.

// Compilation: ( C: dest -- )
//      Append the run-time semantics given below to the current definition,
//      resolving the backward reference dest.

// Run-time: ( -- )
//      Continue execution at the location specified by dest.
//      If no other control flow words are used, any program
//      code after AGAIN will not be executed.

    def('again', function () {
        this.pos = this.cfs.pop();
        // console.log(generate(this.ast));
    }, cxt, { immediate: true });


// 6.1.2140 REPEAT (CORE)

// Interpretation: Interpretation semantics for this word are undefined.

// Compilation: ( C: orig dest -- )
//      Append the run-time semantics given below to the current definition,
//      resolving the backward reference dest. Resolve the forward reference
//      orig using the location following the appended run-time semantics.

// Run-time: ( -- )
//      Continue execution at the location given by dest.

//  : REPEAT ( orig dest -- / -- )
//      \ resolve a single WHILE and return to BEGIN
//      POSTPONE AGAIN  \ uncond. backward branch to dest
//      POSTPONE THEN   \ resolve forward branch from orig
//  ; IMMEDIATE
    def('repeat', function () {
        this.pos = this.cfs.pop();
        var last = this.pos[this.pos.length - 1];
        last.label.name = 'L' + this.label;
        this.label++;

        this.pos = this.cfs.pop();
        var last = this.pos[this.pos.length - 1];
        last.label.name = 'L' + this.orig.pop();
        // console.log(generate(this.ast));
    }, cxt, { immediate: true });


// 15.6.2.0702 AHEAD (TOOLS EXT)

// Interpretation: Interpretation semantics for this word are undefined.

// Compilation: ( C: -- orig )
//      Put the location of a new unresolved forward reference orig onto the
//      control flow stack. Append the run-time semantics given below to the
//      current definition. The semantics are incomplete until orig is resolved
//      (e.g., by THEN).

// Run-time: ( -- )
//      Continue execution at the location specified by the resolution of orig.



// 6.1.1780 LITERAL (CORE)

// Interpretation: Interpretation semantics for this word are undefined.

// Compilation: ( x -- )
//      Append the run-time semantics given below to the current definition.

// Run-time: ( -- x )
//      Place x on the stack.

    def('literal', function () {
        this.pos.push(ast.dpush(this.dpop()));
    }, cxt, { immediate: true });


// 6.1.2520 [CHAR] “bracket-char” (CORE)

// Interpretation: Interpretation semantics for this word are undefined.

// Compilation: ( “<spaces>name” -- )
//      Skip leading space delimiters. Parse name delimited by a space.
//      Append the run-time semantics given below to the current definition.

// Run-time: ( -- char )
//      Place char, the value of the first character of name, on the stack.

    def('[char]', function () {
        var w = this.io.word('\\s');
        this.pos.push(ast.dpush(w.charCodeAt(0)));
    }, cxt, { immediate: true });

// 6.1.2510 ['] “bracket-tick” (CORE)
// Interpretation: Interpretation semantics for this word are undefined.
// Compilation: ( “<spaces>name” -- )
// Skip leading space delimiters. Parse name delimited by a space. Find name.
// Append the run-time semantics given below to the current definition.
// An ambiguous condition exists if name is not found.
// Run-time: ( -- xt )
// Place name’s execution token xt on the stack. The execution token returned
// by the compiled phrase “['] X ” is the same value returned by “' X ” outside
// of compilation state.
    def('[\']', function () {
        var w = this.io.word('\\s');
        var wordLink = this.O[w.toLowerCase()];
        if (wordLink) {
            this.pos.push(ast.dpush(wordLink.index));
        } else {
            console.log('word: ' + w + ' is not defined');
            throw new Error;
        }
    }, cxt, { immediate: true });


// 6.1.2165 S" “s-quote” (CORE)

// Interpretation: Interpretation semantics for this word are undefined.

// Compilation: ( “ccc<quote>” -- )
//      Parse ccc delimited by " (double-quote). Append the run-time semantics
//      given below to the current definition.

// Run-time: ( -- c-addr u )
//      Return c-addr and u describing a string consisting of the characters
//      ccc. A program shall not alter the returned string.
    def('s"', function () {
        var w = this.io.parse('"');
        // TODO copy to the memory
        this.pos.push(ast.dpush(0)); // TODO addr
        this.pos.push(ast.dpush(w.length));
    }, cxt, { immediate: true });

// : DO POSTPONE 2>R HERE ; IMMEDIATE
    def('do', function () {
        var oldpos;
        oldpos = this.pos;
        this.cfs.push(oldpos);
        this.pos = [];
        oldpos.push({
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
                arguments: [
                    {
                        type: Syntax.CallExpression,
                        callee: {
                            type: Syntax.MemberExpression,
                            computed: false,
                            object: {
                                type: Syntax.ThisExpression
                            },
                            property: {
                                type: Syntax.Identifier,
                                name: 'dnext'
                            }
                        },
                        arguments: []
                    }
                ]
            }
        }); // limit
        oldpos.push({
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
                arguments: [
                    {
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
                    }
                ]
            }
        });
        oldpos.push({
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
                        name: 'dpop'
                    }
                },
                arguments: []
            }
        });
        oldpos.push({
            type: Syntax.LabeledStatement,
            label: {
                type: Syntax.Identifier,
                name: 'L' + this.label
            },
            body: {
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
            }
        });
        this.label++;
    }, cxt, { immediate: true });

    def('loop', function () {
        this.pos.push({
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
                arguments: [
                    {
                        type: Syntax.BinaryExpression,
                        operator: '+',
                        left: {
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
                        },
                        right: {
                            type: Syntax.Literal,
                            value: 1,
                            raw: '1'
                        }
                    }
                ]
            }
        });
        this.pos = this.cfs.pop();

        this.pos[this.pos.length - 1].body.test = {
            type: Syntax.BinaryExpression,
            operator: '!==',
            left: {
                type: Syntax.BinaryExpression,
                operator: '>>>',
                left: {
                    type: Syntax.CallExpression,
                    callee: {
                        type: Syntax.MemberExpression,
                        computed: false,
                        object: {
                            type: Syntax.ThisExpression
                        },
                        property: {
                            type: Syntax.Identifier,
                            name: 'rtop'
                        }
                    },
                    arguments: []
                },
                right: {
                    type: Syntax.Literal,
                    value: 0,
                    raw: '0'
                }
            },
            right: {
                type: Syntax.BinaryExpression,
                operator: '>>>',
                left: {
                    type: Syntax.CallExpression,
                    callee: {
                        type: Syntax.MemberExpression,
                        computed: false,
                        object: {
                            type: Syntax.ThisExpression
                        },
                        property: {
                            type: Syntax.Identifier,
                            name: 'rnext'
                        }
                    },
                    arguments: []
                },
                right: {
                    type: Syntax.Literal,
                    value: 0,
                    raw: '0'
                }
            }
        };
        this.pos.push({
            type: Syntax.ExpressionStatement,
            expression: ast.rpop()
        });
        this.pos.push({
            type: Syntax.ExpressionStatement,
            expression: ast.rpop()
        });
    }, cxt, { immediate: true });

    def('+loop', function () {
        this.pos.push({
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
                arguments: [
                    {
                        type: Syntax.BinaryExpression,
                        operator: '+',
                        left: ast.rpop(),
                        right: ast.dpop()
                    }
                ]
            }
        });
        this.pos = this.cfs.pop();

        this.pos[this.pos.length - 1].body.test = {
            type: Syntax.BinaryExpression,
            operator: '!==',
            left: {
                type: Syntax.BinaryExpression,
                operator: '>>>',
                left: {
                    type: Syntax.CallExpression,
                    callee: {
                        type: Syntax.MemberExpression,
                        computed: false,
                        object: {
                            type: Syntax.ThisExpression
                        },
                        property: {
                            type: Syntax.Identifier,
                            name: 'rtop'
                        }
                    },
                    arguments: []
                },
                right: {
                    type: Syntax.Literal,
                    value: 0,
                    raw: '0'
                }
            },
            right: {
                type: Syntax.BinaryExpression,
                operator: '>>>',
                left: {
                    type: Syntax.CallExpression,
                    callee: {
                        type: Syntax.MemberExpression,
                        computed: false,
                        object: {
                            type: Syntax.ThisExpression
                        },
                        property: {
                            type: Syntax.Identifier,
                            name: 'rnext'
                        }
                    },
                    arguments: []
                },
                right: {
                    type: Syntax.Literal,
                    value: 0,
                    raw: '0'
                }
            }
        };
        this.pos.push({
            type: Syntax.ExpressionStatement,
            expression: ast.rpop()
        });
        this.pos.push({
            type: Syntax.ExpressionStatement,
            expression: ast.rpop()
        });
    }, cxt, { immediate: true });

    def('unloop', function () {
        this.pos.push({
            type: Syntax.ExpressionStatement,
            expression: ast.rpop()
        });
        this.pos.push({
            type: Syntax.ExpressionStatement,
            expression: ast.rpop()
        });
    }, cxt, { immediate: true });

    def('leave', function () {
    }, cxt, { immediate: true });

    def('i', function () {
        this.pos.push({
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
                    {
                        type: Syntax.CallExpression,
                        callee: {
                            type: Syntax.MemberExpression,
                            computed: false,
                            object: {
                                type: Syntax.ThisExpression
                            },
                            property: {
                                type: Syntax.Identifier,
                                name: 'rtop'
                            }
                        },
                        arguments: []
                    }
                ]
            }
        });
    }, cxt, { immediate: true });

    def('j', function () {
        this.pos.push({
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
                    {
                        type: Syntax.CallExpression,
                        callee: {
                            type: Syntax.MemberExpression,
                            computed: false,
                            object: {
                                type: Syntax.ThisExpression
                            },
                            property: {
                                type: Syntax.Identifier,
                                name: 'rpick2'
                            }
                        },
                        arguments: []
                    }
                ]
            }
        });
    }, cxt, { immediate: true });

    def('>body', function () {
    }, cxt, { immediate: true });


// 6.1.2120 RECURSE (CORE)

// Interpretation: Interpretation semantics for this word are undefined.

// Compilation: ( -- )
//      Append the execution semantics of the current definition to the current
//      definition. An ambiguous condition exists if RECURSE appears in a
//      definition after DOES>.
    def('recurse', function () {
        var index;
        index = this.L.length;
        this.pos.push(ast.callword(index));
    }, cxt, { immediate: true });

}

module.exports = main;
