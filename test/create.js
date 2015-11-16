'use strict';

var forth = require('../lib'),
    expect = require('chai').expect;

describe('#create', function () {
    it('#create here literal , dup @', function (done) {
        var test = forth();
        expect(test.DS).to.deep.equal([]);
        test.interpret(' create foo here -1 , here foo dup @ 0 @ 1 @ 2 @ 3 @ 4 @', function () {
            expect(test.DS).to.deep.equal([0, 4, 0, -1, -1, -1, -1, -1, 0]);
            done();
        });
    });
    it('#constant literal', function (done) {
        var test = forth();
        test.interpret(' 5 constant five 0 five ', function () {
            expect(test.DS).to.deep.equal([0, 5]);
            done();
        });
    });
    it('#variable literal ! ', function (done) {
        var test = forth();
        test.interpret(' variable v0 55555 ! variable  v1   v0 v1 ', function () {
            expect(test.DS).to.deep.equal([0, 4]);
            done();
        });
    });
    it('#: * ; literal', function (done) {
        var test = forth();
        test.interpret(' 6 : mul * ; 7 mul ', function () {
            expect(test.DS).to.deep.equal([42]);
            done();
        });
    });
    it('#: literal if else then see', function (done) {
        var test = forth();
        test.interpret(': foo if 5 else 7 then ; 0 foo see foo', function () {
            expect(test.DS).to.deep.equal([7]);
            done();
        });
    });
    it('#: literal begin until see', function (done) {
        var test = forth();
        test.interpret(': foo 1 begin 2 until 3 ; foo see foo', function () {
            expect(test.DS).to.deep.equal([1, 3]);
            done();
        });
    });
    it('#: literal begin while repeat see', function (done) {
        var test = forth();
        test.interpret(': foo 1 begin 0 while 3 repeat 4 ; foo see foo', function () {
            expect(test.DS).to.deep.equal([1, 4]);
            done();
        });
    });
    it('#: literal begin while while repeat else then see', function (done) {
        var test = forth();
        test.interpret(': foo 1 begin 2 while 3 while 4 repeat 5 else 6 then 7 ; foo see foo', function () {
            expect(test.DS).to.deep.equal([1, 4, 5, 7]);
            done();
        });
    });
    it('#: code see', function (done) {
        var test = forth();
        test.interpret(' code x6 function () { this.dpush(this.dpop() * 6); } # end-code 7 x6 see x6', function () {
            expect(test.DS).to.deep.equal([42]);
            done();
        });
    });
    it('#: literal do i . loop see', function (done) {
        var test = forth();
        test.interpret(': foo 10 0 do i . loop ; see foo foo ', function () {
            expect(test.DS).to.deep.equal([]);
            done();
        });
    });
    it('#: literal do i . +loop see', function (done) {
        var test = forth();
        test.interpret(': foo 10 0 do i . 2 +loop ; see foo foo ', function () {
            expect(test.DS).to.deep.equal([]);
            done();
        });
    });

});
