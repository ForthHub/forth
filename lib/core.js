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
        console.log();
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

// 6.1.2170 S>D “s-to-d” (CORE)
// ( n -- d )
// Convert the number n to the double-cell number d with the same numerical value.

    def('s>d', function () {
        var t = this.dpop();
        this.dpush(t);
        this.dpush(0); // TODO sign extend?
    }, cxt);

// 6.1.1810 M* “m-star” (CORE)
// ( n1 n2 -- d )
// d is the signed product of n1 times n2 .

    def('m*', function () {
        var t = this.dpop();
        var n = this.dpop();
        var res = t * n;
        this.dpush(res);
        this.dpush(0); // TODO sign extend?
    }, cxt);

// 6.1.2360 UM* “u-m-star” (CORE)
// ( u1 u2 -- ud )
// Multiply u 1 by u 2, giving the unsigned double-cell product ud.
// All values and arithmetic are unsigned.

    def('um*', function () {
        var t = this.dpop();
        var n = this.dpop();
        var res = t * n;
        this.dpush(res);
        this.dpush(0); // TODO sign extend?
    }, cxt);

// 6.1.2214 SM/REM “s-m-slash-rem” (CORE)
// ( d1 n1 -- n2 n3 )
// Divide d1 by n1, giving the symmetric quotient n3 and the remainder n2.
// Input and output stack arguments are signed. An ambiguous condition
// exists if n1 is zero or if the quotient lies outside the range of a
// single-cell signed integer.

    def('sm/rem', function () {
        var t = this.dpop();
        var n = this.dpop();
        var s = this.dpop();
        var r0 = (s / n) | 0;  // TODO i64 ?
        var r1 = (s % n) | 0;
        this.dpush(r1);
        this.dpush(r0);
    }, cxt);

// 6.1.2370 UM/MOD “u-m-slash-mod” (CORE)
// ( ud u1 -- u2 u3 )
// Divide ud by u1, giving the quotient u3 and the remainder u2.
// All values and arithmetic are unsigned. An ambiguous condition exists
// if u1 is zero or if the quotient lies outside the range of
// a single-cell unsigned integer.

    def('um/mod', function () {
        var t = this.dpop();
        var n = this.dpop();
        var s = this.dpop();
        var r0 = (s / n) | 0;  // TODO i64 ?
        var r1 = (s % n) | 0;
        this.dpush(r1);
        this.dpush(r0);
    }, cxt);

    def('hex', function () { this.base = 16; }, cxt);


// tester

    def('testing', function () { this.io.parse('\\\n'); }, cxt);

    def('t{', function () { this.DS = []; }, cxt);

    def('->', function () {
        stash.DS = this.DS;
        this.DS = [];
    }, cxt);

    def('}t', function () {
        var lines;
        try {
            expect(stash.DS).deep.equal(this.DS);
        } catch (err) {
            lines = this.io.buf.slice(0, this.io.ptr).split('\n');
            console.log('\n' + colors.red('Error:') + ' in line: ' + (lines.length - 1));
            lines.pop();
            console.log(lines.pop());
            console.log(err.message);
        }
    }, cxt);
}

module.exports = core;
