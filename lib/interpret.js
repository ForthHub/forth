'use strict';

var word = require('./word');

function interpret (str, done) {
    var w, wordLink;

    this.io.buf = str;
    this.io.ptr = 0;
    this.io.last = str.length - 1;
    while (true) {
        w = this.io.word('\\s');
        if (w === undefined) {
            done();
            return;
        }
        wordLink = this.O[w.toLowerCase()];
        if (this.state) { // compile
            if (wordLink) {
                if (wordLink.immediate) {
                    this[wordLink.index]();
                } else {
                   this.pos.push({
                       type: 'ExpressionStatement',
                       expression: {
                           type: 'CallExpression',
                           callee: {
                               type: 'MemberExpression',
                               computed: true,
                               object: {
                                   type: 'ThisExpression'
                               },
                               property: {
                                   type: 'Literal',
                                   value: wordLink.index,
                                   raw: wordLink.index + ''
                               }
                           },
                           arguments: []
                       }
                   });
               }
            } else {
                if (Number.isNaN(Number(w))) {
                    console.log('word: ' + w + ' is not defined');
                    throw new Error;
                } else {
                    this.pos.push({
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'CallExpression',
                            callee: {
                                type: 'MemberExpression',
                                computed: false,
                                object: {
                                    type: 'ThisExpression'
                                },
                                property: {
                                    type: 'Identifier',
                                    name: 'dpush'
                                }
                            },
                            arguments: [
                                {
                                    type: 'Literal',
                                    value: Number(w),
                                    raw: w
                                }
                            ]
                        }
                    });
                }
            }
        } else { // interpret
            if (wordLink) {
                this[wordLink.index]();
            } else {
                this.dpush(Number(w));
            }
        }
    }
}

function main (cxt) {
    cxt.io = {
        buf: 'nop',
        ptr: 0,
        last: 2,
        word: word.str
    };
    cxt.state = 0; // 0 = interpret, 1 = compile
    cxt.interpret = interpret;
}

module.exports = main;
