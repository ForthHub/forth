'use strict';

var forth = require('../lib'),
    expect = require('chai').expect;

describe('#vocabulary',function () {
    it('#redefinition',function (done) {
        var f = forth();
        f.interpret(' 1 2 3 :  nip  swap ; drop  nip  diz nip ', function () {
            expect(f.DS).to.deep.equal([2, 1]);
            done();
        });
    });
    it('diz', function (done) {
        var test = forth();
        test.interpret(' diz swap', function () {
            done();
        });
    });
    it('see', function (done) {
        var test = forth();
        test.interpret(' immediate see ', function () {
            done();
        });
    });
});
