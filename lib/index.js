'use strict';

var stack = require('../lib/stack'),
    memory = require('../lib/memory'),
    create = require('../lib/create'),
    interpret = require('../lib/interpret');

/**
    @return {Object} instance of Forth machine
*/
function forth () {
    var v = { L: [], O: {} };
    stack(v);
    memory(v);
    interpret(v);
    create(v);
    return v;
}

module.exports = forth;
