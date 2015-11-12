'use strict';

var word = require('./word'),
    ast = require('./ast'),
    // estraverse = require('estraverse'),
    colors = require('colors/safe');

// var Syntax = estraverse.Syntax;

function interpret (str, done) {
    var w, wordLink, num, lines;

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
                   this.pos.push(ast.callword(wordLink.index));
               }
            } else {
                num = parseInt(w, this.base);
                if (Number.isNaN(num)) {
                    lines = this.io.buf.slice(0, this.io.ptr).split('\n');
                    console.log('\n' + colors.red('Error:') + ' in line: ' + (lines.length - 1));
                    console.log('word: ' + w + ' is not defined');
                    console.log(lines.pop());
                    throw new Error;
                } else {
                    this.pos.push(ast.dpush(num));
                }
            }
        } else { // interpret
            if (wordLink) {
                this[wordLink.index]();
            } else {
                num = parseInt(w, this.base);
                if (Number.isNaN(num)) {
                    lines = this.io.buf.slice(0, this.io.ptr).split('\n');
                    console.log('\n' + colors.red('Error:') + ' in line: ' + (lines.length - 1));
                    console.log('word: ' + w + ' is not defined');
                    console.log(lines.pop());
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
