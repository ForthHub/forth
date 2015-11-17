#!/usr/bin/env node
'use strict';

var forth = require('../lib');

var f = forth();

if (process.stdin.isTTY) {
    f.s.push('forth v' + f.pkg.version + '\n');
}

// connect stdin/stdout to the forth stream
process.stdin.setEncoding('ascii');
process.stdin.pipe(f.s).pipe(process.stdout);
