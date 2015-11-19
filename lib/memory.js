'use strict';

// memory load/store words

// TODO move 2@ c! c@ here

var def = require('./def');

function main (cxt) {
    var mem = new ArrayBuffer(0x10000); // 3.3.3 Data space
    cxt.MEMi32 = new Int32Array(mem);
    cxt.MEMi16 = new Int16Array(mem);
    cxt.MEMi8  = new Int8Array(mem);

    cxt.here = 0; // in bytes

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
        this.MEMi32[addr >> 2] = x1; // TODO 32-bit write?
        addr += 4;
        this.MEMi32[addr >> 2] = x2; // TODO 32-bit write?
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
        this.dpush(this.MEMi32[addr >> 2]);
        this.dpush(this.MEMi32[(addr >> 2) + 1]);
    }, cxt);

    def (',', function () {
        var t = this.dpop();
        this.MEMi32[this.here >> 2] = t;
        this.here += 4;
    }, cxt);

    def ('allot', function () {
        this.here += this.dpop();
    }, cxt);

    def ('aligned', function () {
        // this.dpush((this.dpop() + 3) & -4);
        this.dpush(this.dpop());
    }, cxt);

    // def ('align', function () {
    //     // this.dpush((this.dpop() + 3) & -4);
    //     this.dpush(this.dpop());
    // }, cxt);

}

module.exports = main;
