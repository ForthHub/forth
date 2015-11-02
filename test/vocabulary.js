'use strict';

var forth = require('../lib'),
    expect = require('chai').expect;

describe('#vocabulary',function () {
    it('#redefinition',function (done) {
        var f = forth();
        f.interpret(' 1 2 3 :  nip  swap ; drop  nip  see nip ', function () {
            expect(f.DS).to.deep.equal([2, 1]);
            done();
        });
    });
    it('see', function (done) {
        var test = forth();
        test.interpret(' see swap', function () {
            done();
        });
    });
    it('words', function (done) {
        var test = forth();
        test.interpret(' immediate words ', function () {
            done();
        });
    });
});
