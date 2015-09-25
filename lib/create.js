'use strict';

var def = require('./def');

// CREATE

// DOES>

// : : CREATE ] DOES> doLIST ;

// : VARIABLE CREATE 1 CELLS ALLOT ;
// : VARIABLE CREATE 0 , ;


// : ; next [ ; IMMEDIATE
// : ; POSTPONE EXIT  REVEAL POSTPONE [ ; IMMEDIATE


function main (cxt) {

// : CONSTANT CREATE , DOES> @ ;
    def('constant', function () {
        var w = this.io.word('\\s');
        var t = this.dpop();
        def(w, function () {
            this.dpush(t);
        }, this);
    }, cxt);

}

module.exports = main;
