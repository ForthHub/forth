'use strict';

var stack = require('../lib/stack'),
    create = require('../lib/create'),
    interpret = require('../lib/interpret'),
    jsof = require('jsof'),
    expect = require('chai').expect;

describe('#create', function () {

    it('#constant', function (done) {
        var test = { L: [], O: {} };
        stack(test);
        interpret(test);
        create(test);

        expect(test.DS).to.deep.equal([]);
        test.interpret(' 5 constant five five ', function () {
            // console.log(jsof.stringify(test));
            expect(test.DS).to.deep.equal([5]);
            done();
        });
    });

});
