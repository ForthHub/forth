'use strict';

var forth = require('../lib'),
    expect = require('chai').expect;

describe('#interpret', function () {

    it('#literal swap dup nip drop over +', function (done) {
        var test = forth();

        expect(test.DS).to.deep.equal([]);
        test.interpret(' 6    7     ', function () {
            expect(test.DS).to.deep.equal([6, 7]);
            test.interpret(' swap  ', function () {
                expect(test.DS).to.deep.equal([7, 6]);
                test.interpret(' dup 5 nip ', function () {
                    expect(test.DS).to.deep.equal([7, 6, 5]);
                    test.interpret(' drop OVER + nip', function () {
                        expect(test.DS).to.deep.equal([13]);
                        done();
                    });
                });
            });
        });
    });

    it('#literal ! @ *', function (done) {
        var test = forth();

        expect(test.DS).to.deep.equal([]);
        test.interpret(' create foo 333 , 555 , foo ', function () {
            expect(test.DS).to.deep.equal([32]);
            done();
        });
    });
});
