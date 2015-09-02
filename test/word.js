'use strict';

var word = require('../lib/word'),
    expect = require('chai').expect;

function string2ArrayBuffer (str) {
    var i, buf, buf8;

    buf = new ArrayBuffer(str.length);
    buf8 = new Uint8Array(buf);

    for (i = 0; i < str.length; i++) {
        buf8[i] = str.charCodeAt(i);
    }
    return buf;
}

describe('#word', function () {
    it('#string 0', function (done) {
        var delimeter = '\\s';
        var buf = 'ABC  abc de \nf\n\nXYZ';
        var test = {
            buf: buf,
            ptr: 3,
            last: 15,
            word: word
        };
        expect(test.word(delimeter)).to.be.equal('abc');
        expect(test.word(delimeter)).to.be.equal('de');
        expect(test.word(delimeter)).to.be.equal('f');
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.ptr).to.be.equal(16);
        done();
    });
    it('#string 1', function (done) {
        var delimeter = '\\s';
        var buf = 'xy  \n  z';
        var test = {
            buf: buf,
            ptr: 0,
            last: 7,
            word: word
        };
        expect(test.word(delimeter)).to.be.equal('xy');
        expect(test.word(delimeter)).to.be.equal('z');
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.ptr).to.be.equal(8);
        done();
    });
    it('#buffer 0', function (done) {
        var delimeter = '\\s';
        var buf = new Buffer('ABC  abc de \nf\n\nXYZ', 'ascii');
        var test = {
            buf: buf,
            ptr: 3,
            last: 15,
            word: word
        };
        expect(test.word(delimeter)).to.be.equal('abc');
        expect(test.word(delimeter)).to.be.equal('de');
        expect(test.word(delimeter)).to.be.equal('f');
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.ptr).to.be.equal(16);
        done();
    });
    it('#buffer 1', function (done) {
        var delimeter = '\\s';
        var buf = new Buffer('xy  \n  z', 'ascii');
        var test = {
            buf: buf,
            ptr: 0,
            last: 7,
            word: word
        };
        expect(test.word(delimeter)).to.be.equal('xy');
        expect(test.word(delimeter)).to.be.equal('z');
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.ptr).to.be.equal(8);
        done();
    });
    it('#array 0', function (done) {
        var delimeter = '\\s';
        var buf = string2ArrayBuffer('ABC  abc de \nf\n\nXYZ');
        var test = {
            buf: buf,
            ptr: 3,
            last: 15,
            word: word
        };
        expect(test.word(delimeter)).to.be.equal('abc');
        expect(test.word(delimeter)).to.be.equal('de');
        expect(test.word(delimeter)).to.be.equal('f');
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.ptr).to.be.equal(16);
        done();
    });
    it('#array 1', function (done) {
        var delimeter = '\\s';
        var buf = string2ArrayBuffer('xy  \n  z');
        var test = {
            buf: buf,
            ptr: 0,
            last: 7,
            word: word
        };
        expect(test.word(delimeter)).to.be.equal('xy');
        expect(test.word(delimeter)).to.be.equal('z');
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.word(delimeter)).to.be.equal(undefined);
        expect(test.ptr).to.be.equal(8);
        done();
    });
});
