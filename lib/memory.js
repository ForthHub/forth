'use strict';

// memory load/store words

// TODO move 2@ c! c@ here

var def = require('./def');

function main (cxt) {
    var mem = new ArrayBuffer(0x10000); // 3.3.3 Data space
    cxt.MEMi32 = new Int32Array(mem);
    cxt.MEMi16 = new Int16Array(mem);
    cxt.MEMi8  = new Int8Array(mem);
    cxt.here = 32; // in bytes

    // 0 = STATE
    cxt.MEMi32[0] = 0; // 0 = interpret, 1 = compile
    cxt.stateAddr = function () { return 0; };
    cxt.getState = function () { return cxt.MEMi32[0]; };
    cxt.setState = function (val) { cxt.MEMi32[0] = val; };

    // 4 = BASE
    cxt.MEMi32[4] = 10;
    cxt.baseAddr = function () { return 4; };
    cxt.getBase = function () { return cxt.MEMi32[4 >> 2]; };
    cxt.setBase = function (val) { cxt.MEMi32[4 >> 2] = val; };

    // 8 = >IN
    cxt.MEMi32[8] = 0;
    cxt.toinAddr = function () { return 8; };
    cxt.getToin = function () { return cxt.MEMi32[8 >> 2]; };
    cxt.setToin = function (val) { cxt.MEMi32[8 >> 2] = val; };

    def ('here', function () {
        this.dpush(this.here);
    }, cxt);

    def ('!', function () {
        var t = this.dpop();
        var n = this.dpop();
        this.MEMi32[t >> 2] = n;
    }, cxt);

    def ('c!', function () {
        var t = this.dpop();
        var n = this.dpop();
        this.MEMi8[t] = n;
    }, cxt);

    def('2!', function () {
        var addr = this.dpop();
        var x2 = this.dpop();
        var x1 = this.dpop();
        this.MEMi32[addr >> 2] = x2;
        addr += 4;
        this.MEMi32[addr >> 2] = x1;
    }, cxt);

// 2@
// 'c!':   null,
// 'c,':   null,
// 'c@':   null,

// 6.1.0130 +! “plus-store” (CORE)
// ( n|u a-addr -- )
// Add n|u to the single-cell number at a-addr.

    def ('+!', function () {
        var t = this.dpop();
        var n = this.dpop();
        var tmp = this.MEMi32[t >> 2];
        tmp = (tmp + n) | 0;
        this.MEMi32[t >> 2] = tmp;
    }, cxt);

    def('@', function () {
        var addr = this.dpop();
        this.dpush(this.MEMi32[addr >> 2]);
    }, cxt);

    def('c@', function () {
        var addr = this.dpop();
        this.dpush(this.MEMi8[addr]);
    }, cxt);

    def('2@', function () {
        var addr = this.dpop();
        this.dpush(this.MEMi32[(addr >> 2) + 1]);
        this.dpush(this.MEMi32[addr >> 2]);
    }, cxt);

// 6.1.0150 ,
    def (',', function () {
        var t = this.dpop();
        this.MEMi32[this.here >> 2] = t;
        this.here += 4;
    }, cxt);

// 6.1.0860 C,
    def ('c,', function () {
        var t = this.dpop();
        this.MEMi8[this.here] = t;
        this.here += 1;
    }, cxt);

// 6.1.0710 ALLOT
    def ('allot', function () {
        this.here += Math.abs(this.dpop());
    }, cxt);

// 6.1.0706 ALIGNED
    def ('aligned', function () {
        this.dpush((this.dpop() + 3) & -4);
        // this.dpush(this.dpop());
    }, cxt);

// 6.1.0705 ALIGN
    def ('align', function () {
        this.here = (this.here + 3) & -4;
        // this.dpush((this.dpop() + 3) & -4);
        // this.dpush(this.dpop());
    }, cxt);

}

module.exports = main;
