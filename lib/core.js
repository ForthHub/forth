'use strict';

var def = require('./def');

function core (cxt) {

    def('\\', function () {
        this.io.word('\\\n');
    }, cxt, { immediate: true });

    def('(', function () {
        this.io.parse('\\)');
    }, cxt, { immediate: true });

}

module.exports = core;
