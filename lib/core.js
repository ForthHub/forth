'use strict';

var def = require('./def');

function core (cxt) {

    def('\\', function () {
        this.io.word('\\n');
    }, cxt);

    def('(', function () {
        this.io.word(')');
    }, cxt);

}

module.exports = core;
