'use strict';

var stack = require('./stack'),
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
        pkg: pkg,
        L: [],
        O: {}
    };
    stack(v);
    core(v);
    memory(v);
    interpret(v);
    create(v);
    cfg(v);
    return v;
}

module.exports = forth;
