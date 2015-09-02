'use strict';

var colors = require('colors/safe');

var forth = function () {
    var a = [];
    var o = {};
    var state = 0; // interpretation
    var input;
    var toIn = 0;

    var DS = [];
    var RS = [];

    // stack handlers
    function dtop () { DS.slice(-1)[0]; }
    function dpop () { return DS.pop(); }
    function dpush (val) { DS.push(val); }
    // function rtop () { RS.slice(-1)[0]; }
    // function rpop () { return RS.pop(); }
    // function rpush (val) { RS.push(val); }

    // creative words
    function fn (name) {
        return a[o[name]].code;
    }

    function def (name, body, options) {
        var res, definition;
        if (typeof body === 'string') {
            res = 'def(\'' + name + '\', function () {';
            body.split(' ').forEach(function (word) {
                var index = o[word];

                if (index !== undefined) {
                    // check for immediate attribute
                    if (a[index].immediate) {
                        a[index].code();
                    }
                    // compile the call
                    res += ' fn(\'' + word + '\')();';
                } else {
                    // compile the number
                    res += ' dpush(' + word + ');'
                }
            });
            res += ' }, ' + JSON.stringify(options) + ');'
            // console.log(res);
            eval(res);
        } else {
            // function?
            definition = options || {};
            definition.name = name;
            definition.code = body;
            a.push(definition);
        }
        o[name] = a.length - 1;
    }

    function skipWhiteSpace () {
        var last = input.length - 1;
        while (true) {
            if (input[toIn].search(/\s/) === -1) {
                return false;
            }
            if (toIn === last) {
                return true;
            }
            toIn++;
        }
    }

    function getName () {
        var res, len, start;
        len = input.length;
        start = toIn;
        while (true) {
            if (
                (toIn === len) ||
                (input[toIn].search(/\s/) === 0)
            ) {
                return input.slice(start, toIn);
            }
            toIn++;
        }
    }

    function interpret (str) {
        var name;
        input = str;
        toIn = 0;

        // empty string
        if (input.length === 0) {
            return;
        }

        while (true) {
            if (skipWhiteSpace()) {
                return; // end of the stream
            };
            name = getName();
            if(name === undefined) {
                return;
            };
            console.log('"%s" --> %s', name, toIn);
        }
    };

    def(':', function () {
    });

    def(';', function () {
    }, {immediate: true});

    // voacabulary
    def('words', function () {
        var i = a.length,
            res = [];
        while (i--) {
            if (a[i].immediate === true) {
                res.push(colors.red(a[i].name));
            } else {
                res.push(a[i].name);
            }
        }
        console.log(res.join(' '));
    });

    def('.s', function () {
        console.log(DS.join(' '));
    });

    def('drop', function () {
        dpop();
    });

    def('dup', function () {
        var t = dtop();
        dpush(t);
    });

    def('swap', function () {
        var t = dpop();
        var n = dpop();
        dpush(t);
        dpush(n);
    });

    def('+', function () {
        var t = dpop();
        var n = dpop();
        dpush(n + t);
    });

    def('if', function () {
        console.log('[if]');
    }, {immediate: true});

    return {
        DS: DS,
        RS: RS,
        a: a, // debug
        o: o, // debug
        def: def,
        fn: fn,
        interpret: interpret
    };
};

module.exports = forth;
