'use strict';

// stack-only words; using only .dpop .dpush
// TODO add manipulations, double, float, return stack words

var def = require('./def');

function stack (cxt) {
    cxt.DS = [];
    cxt.RS = [];
    cxt.dpop = function () { return this.DS.pop(); },
    cxt.dpush = function (e) { this.DS.push(e); };
    cxt.rpop = function () { return this.RS.pop(); },
    cxt.rpush = function (e) { this.RS.push(e); };

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
        '>r': function () {
            this.rpush(this.dpop());
        },
        'r>': function () {
            this.dpush(this.rpop());
        },
        'r@': function () {
            var rtop = this.rpop();
            this.rpush(rtop);
            this.dpush(rtop);
        },
        '*/': function () {
            var t = this.dpop();
            var n = this.dpop();
            var m = this.dpop();
            this.dpush(m * n / t);
        },
        '*/mod': function () {
            var t = this.dpop();
            var n = this.dpop();
            var m = this.dpop();
            var d = m * n;
            this.dpush(d / t);
            this.dpush(d % t);
        },
        '/mod': function () {
            var t = this.dpop();
            var n = this.dpop();
            this.dpush(n / t);
            this.dpush(n % t);
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
        }
        // m*
        // fm/mod
        // '?dup': null,
        // 'sm/rem':null
        // 's>d':  null,
        // sign
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
    '+:n+t;-:n-t;*:n*t;/:n/t;<>:t!==n;and:n&t;=:n===t;>:n>t;<:n<t;lshift:n<<t;max:Math.max(t,n);min:Math.min(t,n);mod:n%t;or:n|t;rshift:n>>t;u<:n<t;xor:n^t;u>:n>t'
    .split(';')
    .map(function (e) { return e.split(':'); })
    .forEach(function (e) {
        var fn;
        eval('fn = function () { var t = this.dpop(); var n = this.dpop(); this.dpush(' + e[1] + '); };');
        def(e[0], fn, cxt);
    });

}

module.exports = stack;
