'use strict';

// stack-only words; using only .dpop .dpush
// TODO add manipulations, double, float, return stack words

var def = require('./def'),
    Long = require('long');

function stack (cxt) {
    cxt.DS = [];
    cxt.RS = [];
    cxt.dtop = function () { return this.DS[this.DS.length - 1]; },
    cxt.dnext = function () { return this.DS[this.DS.length - 2]; },
    cxt.dpop = function () { return this.DS.pop(); },
    cxt.dpush = function (e) { this.DS.push(e); };
    cxt.rtop = function () { return this.RS[this.RS.length - 1]; },
    cxt.rnext = function () { return this.RS[this.RS.length - 2]; },
    cxt.rpick2 = function () { return this.RS[this.RS.length - 3]; },
    cxt.rpop = function () { return this.RS.pop(); },
    cxt.rpush = function (e) { this.RS.push(e); };

    // stack primitives
    var core = {
        drop: function () {
            this.dpop();
        },
        dup: function () {
            var t = this.dtop();
            this.dpush(t);
        },
        over: function () {
            var n = this.dnext();
            this.dpush(n);
        },
        swap: function () {
            var t = this.dpop();
            var n = this.dpop();
            this.dpush(t);
            this.dpush(n);
        },
        '>r': function () {
            this.rpush(this.dpop());
        },
        'r>': function () {
            this.dpush(this.rpop());
        },
        'r@': function () {
            var rtop = this.rtop();
            this.dpush(rtop);
        },
        // 6.1.0100 */ ( n1 n2 n3 -- n4 ) “star-slash” (CORE)
        // Multiply n1 by n2 producing the intermediate double-cell result d.
        // Divide d by n3 giving the single-cell quotient n4. An ambiguous
        // condition exists if n3 is zero or if the quotient n4 lies outside
        // the range of a signed number. If d and n3 differ in sign, the
        // implementation-defined result returned will be the same as that
        // returned by either the phrase >R M* R> FM/MOD SWAP DROP or
        // the phrase >R M* R> SM/REM SWAP DROP.
        '*/': function () {
            var t = this.dpop() | 0;
            var n = this.dpop() | 0;
            var m = this.dpop() | 0;
            var ddd = Long.fromInt(m);
            ddd = ddd.mul(Long.fromInt(n));
            ddd = ddd.div(Long.fromInt(t));
            ddd = ddd.toInt();
            this.dpush(ddd | 0);
        },

        // 6.1.0110 */MOD “star-slash-mod” (CORE)
        // ( n1 n2 n3 -- n4 n5 )
        // Multiply n1 by n2 producing the intermediate double-cell result d.
        // Divide d by n3 producing the single-cell remainder n4 and the
        // single-cell quotient n5. An ambiguous condition exists if n3 is zero,
        // or if the quotient n5 lies outside the range of a single-cell signed
        // integer. If d and n3 differ in sign, the implementation-defined
        // result returned will be the same as that returned by either
        // the phrase >R M* R> FM/MOD or the phrase >R M* R> SM/REM.
        '*/mod': function () {
            var t = this.dpop() | 0;
            var n = this.dpop() | 0;
            var m = this.dpop() | 0;
            var ddd = Long.fromInt(m);
            ddd = ddd.mul(Long.fromInt(n));

            var r0 = ddd.div(Long.fromInt(t));
            r0 = r0.toInt();

            var r1 = ddd.mod(Long.fromInt(t));
            r1 = r1.toInt();

            this.dpush(r1 | 0);
            this.dpush(r0 | 0);
        },
        '/mod': function () {
            var t = this.dpop() | 0;
            var n = this.dpop() | 0;
            this.dpush((n % t) | 0);
            this.dpush((n / t) | 0);
        },
        nip: function () {
            'swap'();
            'drop'();
        },
        // rot ( x1 x2 x3 -- x2 x3 x1 )
        rot: function () {
            var x3 = this.dpop();
            var x2 = this.dpop();
            var x1 = this.dpop();
            this.dpush(x2);
            this.dpush(x3);
            this.dpush(x1);
        },
        // 2drop ( w1 w2 -- )
        '2drop': function () {
            'drop'();
            'drop'();
        },
        // 2dup ( w1 w2 -- w1 w2 w1 w2 )
        '2dup': function () {
            'over'();
            'over'();
        },
        // 2over ( w1 w2 w3 w4 -- w1 w2 w3 w4 w1 w2 )
        '2over': function () {
            '>r'(); '>r'();
            'over'(); 'over'();
            'r>'();
            'rot'(); 'rot'();
            'r>'();
            'rot'(); 'rot'();
        },
        // 2swap ( w1 w2 w3 w4 -- w3 w4 w1 w2 )
        '2swap': function () {
            'rot'(); '>r'(); 'rot'(); 'r>'();
        },

        'depth': function () {
            this.dpush(this.DS.length);
        },

        // 6.1.1810 M* “m-star” (CORE)
        // ( n1 n2 -- d )
        // d is the signed product of n1 times n2 .
        'm*': function () {
            var t = this.dpop() | 0;
            var n = this.dpop() | 0;
            var ddd = Long.fromInt(n);
            ddd = ddd.mul(Long.fromInt(t));
            this.dpush(ddd.low);
            this.dpush(ddd.high);
        },

        // 6.1.2360 UM* “u-m-star” (CORE)
        // ( u1 u2 -- ud )
        // Multiply u 1 by u 2, giving the unsigned double-cell product ud.
        // All values and arithmetic are unsigned.
        'um*': function () {
            var t = this.dpop() >>> 0;
            var n = this.dpop() >>> 0;
            var nn = Long.fromValue(n, true);
            var tt = Long.fromValue(t, true);
            var ddd = nn.mul(tt);
            this.dpush(ddd.low);
            this.dpush(ddd.high);
        },

        // 6.1.2214 SM/REM “s-m-slash-rem” (CORE)
        // ( d1 n1 -- n2 n3 )
        // Divide d1 by n1, giving the symmetric quotient n3 and the remainder n2.
        // Input and output stack arguments are signed. An ambiguous condition
        // exists if n1 is zero or if the quotient lies outside the range of a
        // single-cell signed integer.
        'sm/rem': function () {
            var t = this.dpop() | 0;
            var n = this.dpop() | 0;
            var s = this.dpop() | 0;
            var ddd = new Long(s, n);

            var ttt = Long.fromInt(t);

            var r0 = ddd.div(ttt);
            r0 = r0.toInt();

            var r1 = ddd.mod(ttt);
            r1 = r1.toInt();

            this.dpush(r1);
            this.dpush(r0);
        },

        // 6.1.2370 UM/MOD “u-m-slash-mod” (CORE)
        // ( ud u1 -- u2 u3 )
        // Divide ud by u1, giving the quotient u3 and the remainder u2.
        // All values and arithmetic are unsigned. An ambiguous condition exists
        // if u1 is zero or if the qukrusaotient lies outside the range of
        // a single-cell unsigned integer.
        'um/mod': function () {
            var t = this.dpop() >>> 0;
            var n = this.dpop() >>> 0;
            var s = this.dpop() >>> 0;
            var ddd = new Long(s, n, true);

            var ttt = Long.fromInt(t);

            var r0 = ddd.div(ttt);
            r0 = r0.toInt();

            var r1 = ddd.mod(ttt);
            r1 = r1.toInt();

            this.dpush(r1);
            this.dpush(r0);
        },

        // fm/mod
        // 6.1.1561 FM/MOD “f-m-slash-mod” (CORE)
        // ( d1 n1 -- n2 n3 )
        // Divide d1 by n1, giving the floored quotient n3 and the remainder n2.
        // Input and output stack arguments are signed. An ambiguous condition
        //  exists if n is zero or if the quotient lies outside 1the range of a
        // single-cell signed integer.
        'fm/mod': function () {
            var t = this.dpop() | 0;
            var n = this.dpop() | 0;
            var s = this.dpop() | 0;
            var ddd = new Long(s, n);
            var ttt = Long.fromInt(t);

            var r0 = ddd.div(ttt);
            r0 = r0.toInt();

            var r1 = ddd.mod(ttt);
            r1 = r1.toInt();

            this.dpush(r1);
            this.dpush(r0);
        },

        // '?dup': null,

        // 6.1.2170 S>D “s-to-d” (CORE)
        // ( n -- d )
        // Convert the number n to the double-cell number d with the same numerical value.
        's>d': function () {
            var t = this.dpop() | 0;
            var ttt = Long.fromInt(t);
            this.dpush(ttt.low);
            this.dpush(ttt.high);
        }
        // sign
    };

    Object.keys(core).forEach(function (key) {
        def(key, core[key], cxt);
    });

    // x1 -- x2
    ' 0< # ((t < 0) ? -1 : 0) ; 0<> # ((t !== 0) ? -1 : 0) ; 0> # ((t > 0) ? -1 : 0) ; 0= # ((t === 0) ? -1 : 0) ; 1+ # (t + 1) | 0 ; 1- # (t - 1) | 0 ; 2* # (t << 1) ; 2/ # (t >> 1) ; abs # Math.abs(t) | 0 ; cell+ # (t + 4) | 0 ; cells # (t * 4) | 0 ; char+ # (t + 1) | 0 ; chars # t ; invert # (t ^ -1) ; negate # ((t ^ -1) + 1) | 0 '
    .split(';')
    .map(function (e) { return e.split('#'); })
    .forEach(function (e) {
        var fn;
        eval('fn = function () { var t = this.dpop() | 0; this.dpush(' + e[1] + '); };');
        def(e[0].trim(), fn, cxt);
    });

    // x1 x2 -- x3
    ' + # (n + t) | 0 ; - # (n - t) | 0 ; * # (n * t) | 0 ; / # (n / t) | 0 ; <> # ((t !== n) ? -1 : 0) ; and # (n & t) ; = # ((n === t) ? -1 : 0) ; > # ((n > t) ? -1 : 0) ; < # ((n < t) ? -1 : 0) ; lshift # (n << t) ; max # (Math.max(t, n)) ; min # (Math.min(t, n)) ; mod # (n % t) | 0; or # (n | t) ; rshift # (n >>> t) ; u< # (((n >>> 0) < (t >>> 0)) ? -1 : 0) ; xor # (n ^ t) ; u> # (((n >>> 0) > (t >>> 0)) ? -1 : 0) '
    .split(';')
    .map(function (e) { return e.split('#'); })
    .forEach(function (e) {
        var fn;
        eval('fn = function () { var t = this.dpop() | 0; var n = this.dpop() | 0; this.dpush(' + e[1] + '); };');
        def(e[0].trim(), fn, cxt);
    });

}

module.exports = stack;
