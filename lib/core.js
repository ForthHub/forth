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
