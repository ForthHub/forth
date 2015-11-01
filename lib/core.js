'use strict';

var def = require('./def');

function core (cxt) {

    def('\\', function () {
        this.io.word('\\n');
    }, cxt);

}

module.exports = core;
