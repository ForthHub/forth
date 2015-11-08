'use strict';

var word = require('./word'),
    estraverse = require('estraverse');

var Syntax = estraverse.Syntax;

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
                {
                    type: Syntax.Literal,
                    value: Number(e),
                    raw: e
                }
            ]
        }
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

function interpret (str, done) {
    var w, wordLink, num;

    this.io.buf = str;
    this.io.ptr = 0;
    this.io.last = str.length - 1;
    while (true) {
        w = this.io.word('\\s');
        if (w === undefined) {
            if (typeof done === 'function') {
                done();
            }
            return;
        }
        wordLink = this.O[w.toLowerCase()];
        if (this.state) { // compile
            if (wordLink) {
                if (wordLink.immediate) {
                    this[wordLink.index]();
                } else {
                   this.pos.push(callword(wordLink.index));
               }
            } else {
                num = parseInt(w, this.base);
                if (Number.isNaN(num)) {
                    console.log('word: ' + w + ' is not defined');
                    throw new Error;
                } else {
                    this.pos.push(dpush(num));
                }
            }
        } else { // interpret
            if (wordLink) {
                this[wordLink.index]();
            } else {
                num = parseInt(w, this.base);
                if (Number.isNaN(num)) {
                    console.log('word: ' + w + ' is not defined');
                    throw new Error;
                } else {
                    this.dpush(num);
                }
            }
        }
    }
}

function main (cxt) {
    cxt.io = {
        buf: 'nop',
        ptr: 0,
        last: 2,
        parse: word.take,
        word: word.str
    };
    cxt.state = 0; // 0 = interpret, 1 = compile
    cxt.interpret = interpret;
}

module.exports = main;
