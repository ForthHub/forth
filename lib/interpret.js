'use strict';

var word = require('./word'),
    ast = require('./ast'),
    // estraverse = require('estraverse'),
    colors = require('colors/safe');

function interpret (str, done) {
    var w, wordLink, num, lines;

    if (typeof str === 'string') {
        str = new Buffer(str, 'ascii');
    }

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
                    this.log('\n' + colors.red('Error:') + ' in line: ' + (lines.length - 1));
                    this.log('word: ' + w + ' is not defined');
                    this.log(lines.pop());
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
                    // lines = this.io.buf.slice(0, this.io.ptr).split('\n');
                    // this.log('\n' + colors.red('Error:') + ' in line: ' + (lines.length - 1));
                    // this.log('word: ' + w + ' is not defined');
                    // this.log(lines.pop());
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
        parse: word.takeBuffer,
        word: word.buf
    };
    cxt.state = 0; // 0 = interpret, 1 = compile
    cxt.log = function (str) { cxt.s.push(new Buffer(str, 'ascii')); };
    cxt.interpret = interpret;
    cxt.s.on('error', function (err) {
        cxt.log('on error');
        throw err;
    });
    cxt.s._write = function (chunk, enc, next) {
        // cxt.log('_write');
        cxt.interpret(chunk, next);
    };
    cxt.s._read = function (n) {
        // cxt.log('_read');
    };
}

module.exports = main;
