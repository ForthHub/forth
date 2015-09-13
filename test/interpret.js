'use strict';

var stack = require('../lib/stack'),
    memory = require('../lib/memory'),
    // word = require('../lib/word'),
    // create = require('../lib/create'),
    interpret = require('../lib/interpret'),

    expect = require('chai').expect;

describe('#interpret', function () {

    it('#stack', function (done) {
        var test = {
            L: [],
            O: {},
            interpret: interpret
        };
        stack(test);

        expect(test.DS).to.deep.equal([]);

        test.interpret(' 6    7     ');
        expect(test.DS).to.deep.equal([6, 7]);

        test.interpret(' swap  ');
        expect(test.DS).to.deep.equal([7, 6]);

        test.interpret(' dup 5 nip ');
        expect(test.DS).to.deep.equal([7, 6, 5]);

        test.interpret(' drop OVER * nip');
        expect(test.DS).to.deep.equal([42]);

        done();
    });

    it('#memory', function (done) {
        var test = {
            L: [],
            O: {},
            interpret: interpret
        };
        stack(test);
        memory(test);

        expect(test.DS).to.deep.equal([]);

        test.interpret(' 6 0 !   7 4 !  0 @ 4 @ *  ');

        expect(test.DS).to.deep.equal([42]);

        done();
    });
});
