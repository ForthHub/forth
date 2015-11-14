#!/usr/bin/env node
'use strict';

var
    concat = require('concat-stream'),
    colors = require('colors/safe'),
    repl = require('repl'),
    forth = require('../lib');

// create clean forth object
var f = forth();

console.log('forth v%s', f.pkg.version);

var buffer = '';

process.stdin.on('data', function(chunk) {
  buffer += chunk.toString('utf8');
});

repl.start({
    prompt: colors.green('\u25B6 '),
    input: process.stdin,
    output: process.stdout,
    eval: function (cmd, context, filename, callback) {
        var tmp = buffer;
        buffer = '';
        f.interpret(tmp, callback);
    }
});



// forth.outputStream.pipe(process.stdout);

// forth.quit();

var s = concat(function (str) {
    f.interpret(str, function () {
        console.log(f.DS);
    });
});

// connect stdin/stdout to the forth stream
process.stdin.setEncoding('utf8');
process.stdin.pipe(s);
