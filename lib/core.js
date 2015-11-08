'use strict';

var def = require('./def'),
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
            expect(this.DS).deep.equal(stash.DS);
        } catch (err) {
            lines = this.io.buf.slice(0, this.io.ptr).split('\n');
            console.log('Error in line: %s', lines.length - 1);
            lines.pop();
            console.log(lines.pop());
            throw err;
        }
    }, cxt);
}

module.exports = core;
