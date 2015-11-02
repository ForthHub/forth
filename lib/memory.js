'use strict';

// memory load/store words

// TODO move 2@ c! c@ here

var def = require('./def');

function main (cxt) {
    var mem = new ArrayBuffer(0x10000); // 3.3.3 Data space
    cxt.MEMi32 = new Int32Array(mem);

    cxt.here = 0; // in bytes

    def ('here', function () {
        this.dpush(this.here);
    }, cxt);

    def ('!', function () {
        var t = this.dpop();
        var n = this.dpop();
        this.MEMi32[t >> 2] = n; // TODO 32-bit write?
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
    def('@', function () {
        var t = this.dpop();
        this.dpush(this.MEMi32[t >> 2]); // TODO 32-bit read?
    }, cxt);

    def (',', function () {
        var t = this.dpop();
        this.MEMi32[this.here >> 2] = t;
        this.here += 4;
    }, cxt);

}

module.exports = main;
