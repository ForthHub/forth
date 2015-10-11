'use strict';

var forth = require('../lib'),
    expect = require('chai').expect;

describe('#interpret', function () {

    it('#stack', function (done) {
        var test = forth();

        expect(test.DS).to.deep.equal([]);
        test.interpret(' 6    7     ', function () {
            expect(test.DS).to.deep.equal([6, 7]);
            test.interpret(' swap  ', function () {
                expect(test.DS).to.deep.equal([7, 6]);
                test.interpret(' dup 5 nip ', function () {
                    expect(test.DS).to.deep.equal([7, 6, 5]);
                    test.interpret(' drop OVER * nip', function () {
                        expect(test.DS).to.deep.equal([42]);
                        done();
                    });
                });
            });
        });
    });

    it('#memory', function (done) {
        var test = forth();

        expect(test.DS).to.deep.equal([]);
        test.interpret(' 6 0 !   7 4 !  0 @ 4 @ *  ', function () {
            expect(test.DS).to.deep.equal([42]);
            done();
        });
    });
});
