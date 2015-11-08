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
        var buf = 'ABC  abc de \nf\n\nXYZ';
        var test = {
            buf: buf,
            ptr: 3,
            last: 15,
            word: word.str
        };
        expect(test.word('\\s')).to.be.equal('abc');
        expect(test.word('\\s')).to.be.equal('de');
        expect(test.word('\\s')).to.be.equal('f');
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.ptr).to.be.equal(16);
        done();
    });
    it('#string 1', function (done) {
        var buf = 'xy  \n  z';
        var test = {
            buf: buf,
            ptr: 0,
            last: 7,
            word: word.str
        };
        expect(test.word('\\s')).to.be.equal('xy');
        expect(test.word('\\s')).to.be.equal('z');
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.ptr).to.be.equal(8);
        done();
    });
    it('#buffer 0', function (done) {
        var buf = new Buffer('ABC  abc de \nf\n\nXYZ', 'ascii');
        var test = {
            buf: buf,
            ptr: 3,
            last: 15,
            word: word.buf
        };
        expect(test.word('\\s')).to.be.equal('abc');
        expect(test.word('\\s')).to.be.equal('de');
        expect(test.word('\\s')).to.be.equal('f');
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.ptr).to.be.equal(16);
        done();
    });
    it('#buffer 1', function (done) {
        var buf = new Buffer('xy  \n  z', 'ascii');
        var test = {
            buf: buf,
            ptr: 0,
            last: 7,
            word: word.buf
        };
        expect(test.word('\\s')).to.be.equal('xy');
        expect(test.word('\\s')).to.be.equal('z');
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.ptr).to.be.equal(8);
        done();
    });
    it('#array 0', function (done) {
        var buf = string2ArrayBuffer('ABC  abc de \nf\n\nXYZ');
        var test = {
            buf: buf,
            ptr: 3,
            last: 15,
            word: word.arr
        };
        expect(test.word('\\s')).to.be.equal('abc');
        expect(test.word('\\s')).to.be.equal('de');
        expect(test.word('\\s')).to.be.equal('f');
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.ptr).to.be.equal(16);
        done();
    });
    it('#array 1', function (done) {
        var buf = string2ArrayBuffer('xy  \n  z');
        var test = {
            buf: buf,
            ptr: 0,
            last: 7,
            word: word.arr
        };
        expect(test.word('\\s')).to.be.equal('xy');
        expect(test.word('\\s')).to.be.equal('z');
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.word('\\s')).to.be.equal(undefined);
        expect(test.ptr).to.be.equal(8);
        done();
    });
});

describe('#take', function () {
    it('#string 0', function (done) {
        var buf = 'ABC  abc de \nf\n\nXYZ';
        var test = {
            buf: buf,
            ptr: 0,
            last: 15,
            take: word.take
        };
        expect(test.take('\\s')).to.be.equal('ABC');
        expect(test.take('c')).to.be.equal(' ab');
        expect(test.take('f')).to.be.equal(' de \n');
        expect(test.take('Y')).to.be.equal('\n\n');
        expect(test.take('\\s')).to.be.equal('');
        expect(test.take('\\s')).to.be.equal('');
        expect(test.ptr).to.be.equal(16);
        done();
    });
});
