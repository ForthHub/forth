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
        if (wordLink) {
            this[wordLink.index]();
        } else {
            this.dpush(Number(w));
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
    cxt.interpret = interpret;
}

module.exports = main;
