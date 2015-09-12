'use strict';

// memory load/store words

// TODO move 2@ c! c@ here

var def = require('./def');

function main (cxt) {
    cxt.MEM = new ArrayBuffer(0x10000); // 3.3.3 Data space

    def ('!', function () {
        var t = this.dpop();
        var n = this.dpop();
        this.MEM[t] = n; // TODO 32-bit write?
    }, cxt);

    def('2!', function () {
        var addr = this.dpop();
        var x2 = this.dpop();
        var x1 = this.dpop();
        this.MEM[addr] = x1; // TODO 32-bit write?
        addr += 4;
        this.MEM[addr] = x2; // TODO 32-bit write?
    }, cxt);

    def('@', function () {
        var t = this.dpop();
        this.dpush(this.MEM[t]); // TODO 32-bit read?
    }, cxt);

}

module.exports = main;
