'use strict';

var word = require('./word');

function interpret (str) {
    var input, w, wordLink;

    input = {
        buf: str,
        ptr: 0,
        last: str.length - 1,
        word: word.str
    };

    while (true) {
        w = input.word('\\s');
        if (w === undefined) { return; }
        wordLink = this.O[w];
        if (wordLink) {
            this[wordLink.index]();
        } else {
            this.dpush(Number(w));
        }
    }
}

module.exports = interpret;
