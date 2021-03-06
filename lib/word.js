'use strict';

function ArrayBuffer2string (ar) {
    var i, res, ar8;

    ar8 = new Uint8Array(ar);
    res = '';

    for (i = 0; i < ar8.length; i++) {
        res += String.fromCharCode(ar8[i]);
    }

    return res;
}


// Skip 'delimiters'
function skip (delimeter) {
    var last, char;

    last = this.last;

    if (this.ptr > last) { // end of buffer
        return;
    }

    while (true) {
        char = this.buf[this.ptr];
        if (char.search(delimeter) === -1) { // end of gap
            return true;
        }
        if (this.ptr === last) { // end of buffer
            this.ptr++;
            return;
        }
        this.ptr++;
    }
}

function skipBuffer (delimeter) {
    var last, char;

    last = this.last;

    if (this.ptr > last) { // end of buffer
        return;
    }

    while (true) {
        char = this.buf[this.ptr];
        if (String.fromCharCode(char).search(delimeter) === -1) { // end of gap
            return true;
        }
        if (this.ptr === last) { // end of buffer
            this.ptr++;
            return;
        }
        this.ptr++;
    }
}

function skipArrayBuffer (delimeter) {
    var last, char, buf8;

    last = this.last;
    if (this.ptr > last) { // end of buffer
        return;
    }

    buf8 = new Uint8Array(this.buf);

    while (true) {
        char = buf8[this.ptr];
        if (String.fromCharCode(char).search(delimeter) === -1) { // end of gap
            return true;
        }
        if (this.ptr === last) { // end of buffer
            this.ptr++;
            return;
        }
        this.ptr++;
    }
}

// Parse characters ccc delimited by 'delimeter'
function take (delimeter) {
    var start, last, res;

    last = this.last;
    start = this.ptr;
    while (true) {
        if (this.ptr > last) {
            // good part
            res = this.buf.slice(start, this.ptr);
            return res;
        }
        if (this.buf[this.ptr].search(delimeter) === 0) {
            // good part
            res = this.buf.slice(start, this.ptr);
            this.ptr++;
            return res;
        }
        this.ptr++;
    }
}

function takeBuffer (delimeter) {
    var start, last, res;

    last = this.last;
    start = this.ptr;
    while (true) {
        if (this.ptr > last) {
            // good part
            res = this.buf.slice(start, this.ptr).toString();
            return res;
        }
        if (String.fromCharCode(this.buf[this.ptr]).search(delimeter) === 0) {
            // good part
            res = this.buf.slice(start, this.ptr).toString();
            this.ptr++;
            return res;
        }
        this.ptr++;
    }
}

function takeArrayBuffer (delimeter) {
    var start, res, last, buf, buf8;

    last = this.last;
    start = this.ptr;
    buf = this.buf;
    buf8 = new Uint8Array(buf);
    while (true) {
        if (this.ptr > last) {
            // good part
            res = buf.slice(start, this.ptr);
            res = ArrayBuffer2string(res);
            return res;
        }
        if (String.fromCharCode(buf8[this.ptr]).search(delimeter) === 0) {
            // good part
            res = buf.slice(start, this.ptr);
            res = ArrayBuffer2string(res);
            this.ptr++;
            return res;
        }
        this.ptr++;
    }
}

function str (delimeter) {
    var res;

    if (skip.call(this, delimeter) === undefined) {
        return;
    };
    // console.log('skip --> %s', this.ptr);
    res = take.call(this, delimeter);
    // console.log('take --> %s %s', this.ptr, res);
    return res;
}

function buf (delimeter) {
    var res;

    if (skipBuffer.call(this, delimeter) === undefined) {
        return;
    };
    // console.log('skip --> %s', this.ptr);
    res = takeBuffer.call(this, delimeter);
    // console.log('take --> %s %s', this.ptr, res);
    return res;
}

function arr (delimeter) {
    var res;

    if (skipArrayBuffer.call(this, delimeter) === undefined) {
        return;
    };
    // console.log('skip --> %s', this.ptr);
    res = takeArrayBuffer.call(this, delimeter);
    // console.log('take --> %s %s', this.ptr, res);
    return res;
}

module.exports = {
    take: take,
    str: str,
    takeBuffer: takeBuffer,
    buf: buf,
    arr: arr
};
