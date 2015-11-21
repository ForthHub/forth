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
        def(
            w,
            'function () { this.dpush(' + this.here + '); }',
            this,
            {dfa: this.here}
        );
    }, cxt);

// CODE
def('code', function () {
    var w = this.io.word('\\s');
    var source = this.io.parse('#');
    def(w, source, this);
}, cxt);

def('end-code', function () {
}, cxt);

// : DOES> ??? ; IMMEDIATE
// : POSTPONE ' LITERAL ['] , LITERAL ; IMMEDIATE \ : POSTPONE ' , ;

// : VARIABLE CREATE 1 CELLS ALLOT ;
// : VARIABLE CREATE 0 , ;
    def('variable', function () {
        var w = this.io.word('\\s');
        def(
            w,
            'function () { this.dpush(' + this.here + '); }',
            this,
            {dfa: this.here}
        );
        this.here += 4;
    }, cxt);

// : CONSTANT CREATE , DOES> @ ;
    def('constant', function () {
        var w = this.io.word('\\s');
        var t = this.dpop();
        def(
            w,
            'function () { this.dpush(' + t + '); }',
            this
        );
    }, cxt);

/*
    15.6.1.2465 WORDS (TOOLS)

( -- )
    List the definition names in the first word list of the search order. The
    format of the display is implementation-dependent.

    WORDS may be implemented using pictured numeric output words. Consequently,
    its use maycorrupt the transient region identified by #>.
*/
    def('words', function () {
        var list = this.L.map(function (e) {
            if (this.O[e.name].immediate) {
                return colors.yellow(e.name);
            }
            return e.name;
        }, this);
        cxt.log(list.join(' ') + '\n');
    }, cxt);

/*
    15.6.1.2194 SEE (TOOLS)

( “<spaces>name” -- )
    Display a human-readable representation of the named word’s definition. The
    source of the representation (object-code decompilation, source block, etc.)
    and the particular form of the display is implementation defined.

    SEE may be implemented using pictured numeric output words. Consequently,
    its use may corrupt the transient region identified by #>.

*/
    def('see', function () {
        var w = this.io.word('\\s').toLowerCase();
        // var list = this.L.map(function (e) {
        //     return colors.green(e.name) + ': ' + this[this.O[e.name].index];
        // }, this);
        // cxt.log(list.join('\n'));
        cxt.log(colors.green(w) + ': ' + this[this.O[w].index].toString() + '\n');
    }, cxt);

// 6.1.0070 ' “tick” (CORE)
// ( “<spaces>name” -- xt )
// Skip leading space delimiters. Parse name delimited by a space.
// Find name and return xt, the execution token for name. An ambiguous
// condition exists if name is not found.

    def('\'', function () {
        var w = this.io.word('\\s');
        var wordLink = this.O[w.toLowerCase()];
        if (wordLink) {
           this.dpush(wordLink.index);
        } else {
            cxt.log('word: ' + w + ' is not defined');
            throw new Error;
        }
    }, cxt);

// 6.1.1370 EXECUTE
    def('execute', function () {
        var xt = this.dpop();
        this[xt].call(this);
    }, cxt);
// EVALUATE
}

module.exports = main;
