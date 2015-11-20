'use strict';

var parse = require('esprima').parse,
    generate = require('escodegen').generate;

function does (fn, cxt) {
    var oldtree, newtree, oldpos, newpos, fn;

    oldtree = parse('fn = ' + fn.toString());
    oldpos = oldtree.body[0].expression.right.body.body;

    newtree = parse('fn = ' + cxt[cxt.L.length - 1].toString());
    newpos = newtree.body[0].expression.right.body.body;

    oldpos.forEach(function (e) {
        newpos.push(e);
    });
    eval(generate(newtree));
    cxt[cxt.L.length - 1] = fn;
}

module.exports = does;
