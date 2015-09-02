'use strict';

var colors = require('colors/safe');

exports.tick = function () { // '
}

exports.paren = function () { // (
}
exports.paren.immediate = true;

exports.colon = function () { // :
}

exports.char = function () {
}

exports.constant = function () {
}

exports.create = function () {
}

exports.postpone = function () {
}

exports.variable = function () {
}

exports.bracketTick = function () { // [']
}

exports.bracketChar = function () {
}

exports.words = function () { // tools
    console.log(
        Object
        .keys(this)
        .map(function (word) {
            if (this[word] && this[word].immediate) {
                return colors.red(word);
            }
            return word;
        }, this)
        .join(' ')
    );
};

exports.see = function (ptr) {
    console.log(ptr.toString());
};

/*
Empty the return stack, store zero in SOURCE-ID if it is present, make the user
input device the input source, and enter interpretation state. Do not display a
message. Repeat the following:

  * Accept a line from the input source into the input buffer, set >IN to zero,
    and interpret.

  * Display the implementation-defined system prompt if in interpretation state,
    all processing has been completed, and no ambiguous condition exists.

: QUIT
    ( empty the return stack and set the input source to the user input device )
    POSTPONE [
        REFILL
    WHILE
        [’] INTERPRET CATCH
        CASE
         0 OF STATE @ 0= IF ." OK" THEN CR ENDOF
        -1 OF ( Aborted ) ENDOF
        -2 OF ( display message from ABORT" ) ENDOF
        ( default ) DUP ." Exception # " .
        ENDCASE
    REPEAT BYE
;

*/

exports.quit = function () {
    var that = this;
    // Empty the return stack
    this.RS = [];
    // register callbacks to the input source stream
    this.inputStream._write = function (chunk, enc, next) {
        console.log('chunk: [', chunk);
        // read chunk into buffer and interpret
        that.inputBuffer = chunk;
        var start, name, fn, i = 0;
        // do {
            // skip white space
            while (chunk[i] === 32) { i++; }
            start = i;
            // slip non-white space
            while (chunk[i] !== 32) { i++; }
            name = that.inputBuffer.toString('ascii', start, i);
            console.log(name, start, i);
            // fn = that[name];
            // if (fn) {
            //     fn.call(that);
            // } else {
            //     that.DS.push(Number(name));
            // }
        // } while (i < (chunk.length - 2))
        console.log(']');
        next();
    };
}



exports.interpret = function () {
}
