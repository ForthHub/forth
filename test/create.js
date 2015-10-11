'use strict';

var stack = require('../lib/stack'),
    create = require('../lib/create'),
    interpret = require('../lib/interpret'),
    expect = require('chai').expect;

describe('#create', function () {

    it('#constant', function (done) {
        var test = { L: [], O: {} };
        stack(test);
        interpret(test);
        create(test);

        expect(test.DS).to.deep.equal([]);
        test.interpret(' 5 constant five five ', function () {
            expect(test.DS).to.deep.equal([5]);
            done();
        });
    });

});
