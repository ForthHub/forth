'use strict';

var def = require('./def'),
    Long = require('long'),
    colors = require('colors/safe'),
    expect = require('chai').expect;

function core (cxt) {
    cxt.setBase(10);
    var stash = {};

    def('\\', function () {
        this.io.parse('\\\n');
    }, cxt, { immediate: true });

    def('(', function () {
        this.io.parse('\\)');
    }, cxt, { immediate: true });

    def('.(', function () {
        var str = this.io.parse('\\)');
        this.log(str);
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

    def('.s', function () {
        cxt.DS.forEach(function (e) {
            cxt.log(' ' + e);
        });
    }, cxt);

// 15.6.1.1280 DUMP (TOOLS)
// ( addr u -- )
// Display the contents of u consecutive addresses starting at addr.
// The format of the display is implementation dependent.
    def('dump', function () {
        var ilen = this.dpop();
        var addr = this.dpop();
        var i;
        for (i = 0; i < ilen; i++) {
            cxt.log(' ' + this.MEMi8[addr + i]);
        }
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

    def('hex', function () { this.setBase(16); }, cxt);

    def('decimal', function () { this.setBase(10); }, cxt);





// 6.1.0490 <# “less-number-sign”
// Initialize the pictured numeric output conversion process.
    def('<#', function () { // ( -- )
        this.picturedNumericOutputAddress = this.here + 128;
        this.picturedNumericOutputLength = 0;
    }, cxt);

// 6.1.0040 #>
    def('#>', function () {
        this.dpop();
        this.dpop();
        this.dpush(this.picturedNumericOutputAddress + 1);
        this.dpush(this.picturedNumericOutputLength);
    }, cxt);

// 6.1.1670 HOLD
    def('hold', function () {
        var char = this.dpop() >>> 0;
        this.MEMi8[this.picturedNumericOutputAddress] = char;
        this.picturedNumericOutputAddress -= 1;
        this.picturedNumericOutputLength += 1;
    }, cxt);

// 6.1.2210 SIGN
    def('sign', function () { // ( n -- )
        var t = this.dpop() | 0;
        if (t < 0) {
            this.MEMi8[this.picturedNumericOutputAddress] = 45;
            this.picturedNumericOutputAddress -= 1;
            this.picturedNumericOutputLength += 1;
        }
    }, cxt);

// 6.1.0030 # “number-sign”
// Divide ud1 by the number in BASE giving the quotient ud2 and the remainder n.
// (n is the least-significant digit of ud1.) Convert n to external form
// and add the resulting character to the beginning of the pictured numeric
// output string.
    def('#', function () { // ( ud1 -- ud2 )
        var t = this.dpop() >>> 0;
        var n = this.dpop() >>> 0;
        var dd = new Long(n, t, true);
        var base = this.getBase();

        var r1 = dd.mod(base);
        var char = r1.toInt();
        if (char < 10) {
            char += 48;
        } else {
            char += 55;
        }

        this.MEMi8[this.picturedNumericOutputAddress] = char;

        this.picturedNumericOutputAddress -= 1;
        this.picturedNumericOutputLength += 1;

        dd = dd.div(base);

        this.dpush(dd.low);
        this.dpush(dd.high);
    }, cxt);


// 6.1.0050 #S
    def('#s', function () {
        var t = this.dpop() >>> 0;
        var n = this.dpop() >>> 0;
        var dd = new Long(n, t, true);
        var base = this.getBase();

        do {
            var r1 = dd.mod(base);
            var char = r1.toInt();
            if (char < 10) {
                char += 48;
            } else {
                char += 55;
            }
            this.MEMi8[this.picturedNumericOutputAddress] = char;

            this.picturedNumericOutputAddress -= 1;
            this.picturedNumericOutputLength += 1;

            dd = dd.div(base, true);
        } while (!dd.eq(0));

        this.dpush(dd.low);
        this.dpush(dd.high);

    }, cxt);


// 6.1.0560 >IN
    def('>in', function () {
        this.dpush(this.toinAddr());
    }, cxt);

// 6.1.0570 >NUMBER
    def('>number', function () { }, cxt);

// 6.1.0670 ABORT
    def('abort', function () { }, cxt);

// 6.1.0680 ABORT"
    def('abort"', function () { }, cxt);

// 6.1.0695 ACCEPT
    def('accept', function () { }, cxt);

// 6.1.0750 BASE
    def('base', function () {
        this.dpush(this.baseAddr());
    }, cxt);

// 6.1.0980 COUNT
    def('count', function () {
        var addr = this.dpop();
        var len = this.MEMi8[addr];
        this.dpush(addr + 1);
        this.dpush(len);
    }, cxt);

// 6.1.1320 EMIT ( x -- )
    def('emit', function () {
        this.log(String.fromCharCode(this.dpop() >>> 0));
    }, cxt);

// 6.1.1360 EVALUATE ( i*x c-addr u -- j*x )
    def('evaluate', function () {
        var str = '';
        var len = this.dpop();
        var addr = this.dpop();

        // Save the current input source specification
        var buf = this.io.buf;
        var ptr = this.io.ptr;
        var last = this.io.last;

        // Make the string described by c-addr and u both the input
        // source and input buffer, set >IN to zero
        var i;
        for (i = 0; i < len; i++) {
            str += String.fromCharCode(this.MEMi8[addr + i]);
        }
        // , and interpret
        this.interpret(str);

        // When the parse area is empty, restore the prior input
        // source specification.
        this.io.buf = buf;
        this.io.ptr = ptr;
        this.io.last = last;
    }, cxt);

// 6.1.1380 EXIT
    def('exit', function () { }, cxt);

// 6.1.1540 FILL
    def('fill', function () { }, cxt);

// 6.1.1550 FIND
    def('find', function () {
        'count'();
        var len = this.dpop();
        var addr = this.dpop();
        var str = '';
        var i;
        for (i = 0; i < len; i++) {
            str += String.fromCharCode(this.MEMi8[addr + i]);
        }
        str = str.toLowerCase();
        var wordLink = this.O[str];
        if (wordLink) {
            this.dpush(wordLink.index);
            if (wordLink.immediate) {
                this.dpush(1);
            } else {
                this.dpush(-1);
            }
        } else {
            this.dpush(addr);
            this.dpush(0);
        }
    }, cxt);

// 6.1.1750 KEY
    def('key', function () {
        this.dpush(42); // TODO
    }, cxt);

// 6.1.1900 MOVE
    def('move', function () { }, cxt);

// 6.1.2050 QUIT
    def('quit', function () { }, cxt);

// 6.1.2216 SOURCE
    def('source', function () {
        this.dpush(this.here);
        this.dpush(this.io.last - this.io.ptr);
    }, cxt);

// 6.1.2310 TYPE
    def('type', function () { // ( c-addr u -- )
        var len = this.dpop();
        var addr = this.dpop();
        var i, char;
        for (i = 0; i < len; i++) {
            char = this.MEMi8[addr + i];
            cxt.log(String.fromCharCode(char));
        }
    }, cxt);

// 6.1.2320 U.
    def('u.', function () {
        cxt.log(' ' + (this.dpop() >>> 0));
    }, cxt);

// 6.1.2450 WORD
    def('word', function () {
        var char = this.dpop();
        var w = this.io.word(String.fromCharCode(char));
        var i, ilen, here;
        here = this.here;
        for (i = 0, ilen = w.length; i < ilen; i++) {
            this.MEMi8[here + i] = w.charCodeAt(i);
        }
        this.MEMi8[here + ilen] = 0;
        this.here += (ilen + 1);
        this.dpush(here);
    }, cxt);






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
            cxt.log(colors.red('Error:') + ' in line: ' + (lines.length - 1) + ' ');
            l0 = lines.pop();
            l1 = lines.pop();
            cxt.log(l1 + ' ' + l0 + ' ');
            cxt.log(err.message);
        }
        cxt.log('.\n');
    }, cxt);
}

module.exports = core;
