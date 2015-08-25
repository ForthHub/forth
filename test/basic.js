'use strict';

var forth = require('../lib'),
    expect = require('chai').expect;

describe('#basic', function () {
    it('#words', function () {
        forth.words();
    });
    it('#see', function () {
        forth.see(forth.see);
    });
    it('#minus', function () {
        forth.DS = [7, 3];
        forth['-']();
        expect(forth.DS).to.deep.equal([4]);
    });
});
