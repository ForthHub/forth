'use strict';

// memory load/store words

exports['!'] = function () {
    var t = this.DS.pop();
    var n = this.DS.pop();
    this.MEM[t] = n; // TODO 32-bit write?
};

exports['2!'] = function () {
    var addr = this.DS.pop();
    var x2 = this.DS.pop();
    var x1 = this.DS.pop();
    this.MEM[addr] = x1; // TODO 32-bit write?
    addr += 4;
    this.MEM[addr] = x2; // TODO 32-bit write?
};

exports['@'] = function () {
    var t = this.DS.pop();
    this.DS.push(this.MEM[t]); // TODO 32-bit read?
};

// TODO move 2@ c! c@ here
