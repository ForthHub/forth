'use strict';

var colors = require('colors/safe'),
    def = require('./def');

function main (cxt) {

// IMMEDIATE
    def('immediate', function () {
        var len = this.L.length;
        var last = this.L[len - 1];
        var name = last.name;
        var obj = this.O[name];
        obj.immediate = true;
    }, cxt);

// CREATE
    def('create', function () {
        var w = this.io.word('\\s');
        var here = this.here;
        def(w, function () {
            this.dpush(here);
        }, this);
    }, cxt);

// DOES>

// : VARIABLE CREATE 1 CELLS ALLOT ;
// : VARIABLE CREATE 0 , ;
    def('variable', function () {
        var w = this.io.word('\\s');
        var here = this.here;
        this.here += 4;
        def(w, function () {
            this.dpush(here);
        }, this);
    }, cxt);

// : CONSTANT CREATE , DOES> @ ;
    def('constant', function () {
        var w = this.io.word('\\s');
        var t = this.dpop();
        def(w, function () {
            this.dpush(t);
        }, this);
    }, cxt);

// SEE
    def('see', function () {
        var list = this.L.map(function (e) {
            if (this.O[e.name].immediate) {
                return colors.red(e.name);
            }
            return e.name;
        }, this);
        console.log(list.join(' '));
    }, cxt);

// DIZ
    def('diz', function () {
        var w = this.io.word('\\s');
        // var list = this.L.map(function (e) {
        //     return colors.green(e.name) + ': ' + this[this.O[e.name].index];
        // }, this);
        // console.log(list.join('\n'));
        console.log(colors.green(w) + ': ' + this[this.O[w].index]);
    }, cxt);

}

module.exports = main;
