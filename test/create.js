'use strict';

var forth = require('../lib'),
    expect = require('chai').expect;

describe('#create', function () {

    it('#constant', function (done) {
        var test = forth();

        expect(test.DS).to.deep.equal([]);
        test.interpret(' 5 constant five five ', function () {
            expect(test.DS).to.deep.equal([5]);
            done();
        });
    });

});
