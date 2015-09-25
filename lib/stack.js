'use strict';

// stack-only words; using only .dpop .dpush
// TODO add manipulations, double, float, return stack words

var def = require('./def');

function stack (cxt) {
    cxt.DS = [];
    cxt.RS = [];
    cxt.dpop = function () { return this.DS.pop(); },
    cxt.dpush = function (e) { this.DS.push(e); };

    // stack primitives
    var core = {
        drop: function () {
            this.dpop();
        },
        dup: function () {
            var t = this.dpop();
            this.dpush(t);
            this.dpush(t);
        },
        over: function () {
            var t = this.dpop();
            var n = this.dpop();
            this.dpush(n);
            this.dpush(t);
            this.dpush(n);
        },
        swap: function () {
            var t = this.dpop();
            var n = this.dpop();
            this.dpush(t);
            this.dpush(n);
        },
        nip: function () {
            'swap'();
            'drop'();
        }
    };

    Object.keys(core).forEach(function (key) {
        def(key, core[key], cxt);
    });

    // x1 -- x2
    '0<:t<0;0<>:t!==0;0>:t>0;0=:t===0;1+:t+1;1-:t-1;2*:t<<1;2/:t>>1;abs:Math.abs(t);cell+:t+4;cells:t*4;char+:t+1;chars:t;invert:~t;negate:-t'
    .split(';')
    .map(function (e) { return e.split(':'); })
    .forEach(function (e) {
        var fn;
        eval('fn = function () { var t = this.dpop(); this.dpush(' + e[1] + '); };');
        def(e[0], fn, cxt);
    });

    // x1 x2 -- x3
    '+:n+t;-:n-t;*:n*t;/:n/t;<>:t!==n;and:n&t;=:n===t;>:n>t;<:n<t;lshift:n<<t;max:Math.max(t,n);min:Math.min(t,n);mod:n%t;or:n|t;rshift:n>>t;u<:n<t;xor:n^t;nip:t;u>:n>t'
    .split(';')
    .map(function (e) { return e.split(':'); })
    .forEach(function (e) {
        var fn;
        eval('fn = function () { var t = this.dpop(); var n = this.dpop(); this.dpush(' + e[1] + '); };');
        def(e[0], fn, cxt);
    });

}

module.exports = stack;
