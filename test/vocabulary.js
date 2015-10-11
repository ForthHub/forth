'use strict';

var forth = require('../lib');

describe('#vocabulary',function () {
    it('#redefinition',function (done) {
        var f = forth();
        // f.def('nip', 'swap drop');
        // f.def('test', '1 6 7 + 3 nip words .s if');
        // f.fn('test')();
        // console.log(jsof.stringify(f));
        f.interpret(' :  nip  swap drop ;  nip   ');
        done();
    });
});
