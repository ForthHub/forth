'use strict';

var stream = require('stream'),
    stack = require('./stack'),
    core = require('./core'),
    memory = require('./memory'),
    interpret = require('./interpret'),
    create = require('./create'),
    cfg = require('./cfg'),
    pkg = require('../package.json');

/**
    @return {Object} instance of Forth machine
*/
function forth () {
    var v = {
        s: stream.Duplex(),
        pkg: pkg,
        L: [],
        O: {}
    };
    interpret(v);
    stack(v);
    core(v);
    memory(v);
    create(v);
    cfg(v);
    return v;
}

module.exports = forth;
