'use strict';

var forth = require('../lib'),
    expect = require('chai').expect;

describe('#create', function () {
    it('#create here literal , dup @', function (done) {
        var test = forth();
        expect(test.DS).to.deep.equal([]);
        test.interpret(' create foo here 0xffffffff , here foo dup @ 0 @ 1 @ 2 @ 3 @ 4 @', function () {
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
    it('#: literal if else then diz', function (done) {
        var test = forth();
        test.interpret(': foo if 5 else 7 then ; 0 foo diz foo', function () {
            expect(test.DS).to.deep.equal([7]);
            done();
        });
    });

});
