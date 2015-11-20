'use strict';

var def = require('./def'),
    colors = require('colors/safe'),
    expect = require('chai').expect;

function core (cxt) {
    cxt.base = 10;
    var stash = {};

    def('\\', function () {
        this.io.parse('\\\n');
    }, cxt, { immediate: true });

    def('(', function () {
        this.io.parse('\\)');
    }, cxt, { immediate: true });

// 6.1.0990 CR  “c-r” (CORE)
// ( -- )
// Cause subsequent output to appear at the beginning of the next line.
    def('cr', function () {
        cxt.log('\n');
    }, cxt);

// 6.1.2220 SPACE
    def('space', function () {
        cxt.log(' ');
    }, cxt);

// 6.1.2230 SPACES
    def('spaces', function () {
        cxt.log(' '.repeat(this.dpop()));
    }, cxt);

    def('bl', function () {
        this.dpush(32);
    }, cxt);

    def('.', function () {
        cxt.log(' ' + this.dpop());
    }, cxt);

// 6.1.0895 CHAR “char” (CORE)
// ( “<spaces>name” -- char )
// Skip leading space delimiters. Parse name delimited by a space.
// Put the value of its first character onto the stack.
    def('char', function () {
        var w = this.io.word('\\s');
        this.dpush(w.charCodeAt(0));
    }, cxt);

// 6.1.0630 ?DUP “question-dupe” (CORE)
// ( x -- 0 | x x )
// Duplicate x if it is non-zero.

    def('?dup', function () {
        var t = this.dpop();
        if (t !== 0) {
            this.dpush(t);
        }
        this.dpush(t);
    }, cxt);

    def('hex', function () { this.base = 16; }, cxt);

    def('decimal', function () { this.base = 10; }, cxt);

// 6.1.0030 #
    def('#', function () { }, cxt);

// 6.1.0040 #>
    def('#>', function () { }, cxt);

// 6.1.0050 #S
    def('#s', function () { }, cxt);

// 6.1.0560 >IN
    def('>in', function () { }, cxt);

// 6.1.0570 >NUMBER
    def('>number', function () { }, cxt);

// 6.1.0670 ABORT
    def('abort', function () { }, cxt);

// 6.1.0680 ABORT"
    def('abort"', function () { }, cxt);

// 6.1.0695 ACCEPT
    def('accept', function () { }, cxt);

// 6.1.0980 COUNT
    def('count', function () { }, cxt);

// 6.1.1320 EMIT ( x -- )
    def('emit', function () {
        this.log(String.fromCharCode(this.dpop() >>> 0));
    }, cxt);

// 6.1.1360 EVALUATE ( i*x c-addr u -- j*x )
    def('evaluate', function () {

    }, cxt);

// 6.1.1380 EXIT
    def('exit', function () { }, cxt);

// 6.1.1540 FILL
    def('fill', function () { }, cxt);

// 6.1.1550 FIND
    def('find', function () { }, cxt);

// 6.1.1670 HOLD
    def('hold', function () { }, cxt);

// 6.1.1750 KEY
    def('key', function () {
        this.dpush(42); // TODO
    }, cxt);

// 6.1.1900 MOVE
    def('move', function () { }, cxt);

// 6.1.2050 QUIT
    def('quit', function () { }, cxt);

// 6.1.2210 SIGN
    def('sign', function () { }, cxt);

// 6.1.2216 SOURCE
    def('source', function () { }, cxt);

// 6.1.2310 TYPE
    def('type', function () { }, cxt);

// 6.1.2320 U.
    def('u.', function () { }, cxt);

// 6.1.2450 WORD
    def('word', function () { }, cxt);






// tester

    def('testing', function () { this.io.parse('\\\n'); }, cxt);

    def('t{', function () { this.DS = []; }, cxt);

    def('->', function () {
        stash.DS = this.DS;
        this.DS = [];
    }, cxt);

    def('}t', function () {
        var lines, l0, l1;
        try {
            expect(stash.DS).deep.equal(this.DS);
        } catch (err) {
            lines = this.io.buf.toString().slice(0, this.io.ptr).split('\n');
            cxt.log('\n' + colors.red('Error:') + ' in line: ' + (lines.length - 1) + '\n');
            l0 = lines.pop();
            l1 = lines.pop();
            cxt.log(l1 + '\n' + l0 + '\n');
            cxt.log(err.message);
        }
        cxt.log('.\n');
    }, cxt);
}

module.exports = core;
