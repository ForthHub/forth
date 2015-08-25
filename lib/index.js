'use strict';

var tools = require('./tools'),
    memory = require('./memory'),
    cfg = require('./cfg');

var words = {
    DS:     [],
    RS:     [],
    CS:     [],
    MEM:    new ArrayBuffer(0x10000), // 3.3.3 Data space
    '!':    memory['!'],
    '#':    null,
    '#>':   null,
    '#s':   null,
    '`':    null,
    '(':    null,
    '*/':   function () {
        var t = this.DS.pop();
        var n = this.DS.pop();
        var m = this.DS.pop();
        this.DS.push(m * n / t);
    },
    '*/mod': function () {
        var t = this.DS.pop();
        var n = this.DS.pop();
        var m = this.DS.pop();
        var d = m * n;
        this.DS.push(d / t);
        this.DS.push(d % t);
    },
    '+loop': cfg['+loop'],
    ',':    null,
    '.':    function () { console.log(this.DS.pop()); },
    '."':   null,
    '/mod': function () {
        var t = this.DS.pop();
        var n = this.DS.pop();
        this.DS.push(n / t);
        this.DS.push(n % t);
    },
    '2!':   memory['2!'],
    '2@':   null,
    '2drop':null,
    '2dup': null,
    '2over':null,
    '2swap':null,
    ':':    null,
    ';':    cfg[';'],
    '<#':   null,
    '>in':  null,
    '>number': null,
    '>r':   function () { this.RS.push(this.DS.pop()); },
    '?dup': null,
    '@':    memory['@'],
    abort:  null,
    'abort"': null,
    accept: null,
    align:  null,
    aligned:null,
    allot:  null,
    base:   null,
    begin:  cfg.begin,
    bl:     null,
    'c!':   null,
    'c,':   null,
    'c@':   null,
    char:   null,
    constant:null,
    count:  null,
    cr:     null,
    create: null,
    decimal:null,
    depth:  null,
    do:     cfg.do,
    'does>':cfg['does>'],
    drop:   function () { this.DS.pop(); },
    dup:    function () { this.DS.push(this.DS.slice(-1)[0]); },
    else:   cfg.else,
    emit:   null,
    'environment?': null,
    evaluate:null,
    execute:null,
    exit:   null,
    fill:   null,
    find:   null,
    'fm/mod': null,
    here:   null,
    hold:   null,
    i:      null,
    if:     cfg.if,
    immediate: null,
    j:      null,
    key:    null,
    leave:  null,
    literal:null,
    loop:   cfg.loop,
    'm*':   null,
    move:   null,
    over:   null,
    postpone:null,
    quit:   null,
    'r>':   function () { this.DS.push(this.RS.pop()); },
    'r@':   null,
    recurse:null,
    repeat: cfg.repeat,
    rot:    null,
    's"':   null,
    's>d':  null,
    sign:   null,
    'sm/rem':null,
    source: function () { this.DS.push(this.inputBufferStart), this.DS.push(this.inputBufferEnd); },
    space:  null,
    spaces: null,
    state:  null,
    swap:   null,
    then:   cfg.then,
    type:   null,
    'u.':   null,
    'u<':   null,
    'um*':  null,
    'um/mod':null,
    unloop: null,
    until:  cfg.until,
    variable:null,
    while:  cfg.while,
    word:   null,
    words:  tools.words,
    '[`]':  null,
    '[char]':null,
    ']':    null,
    inputBufferStart: 0,
    see:    tools.see
};

// x1 -- x2
'0<:t<0;0<>:t!==0;0>:t>0;0=:t===0;1+:t+1;1-:t-1;2*:t<<1;2/:t>>1;abs:Math.abs(t);cell+:t+4;cells:t*4;char+:t+1;chars:t;invert:~t;negate:-t'
.split(';')
.map(function (e) { return e.split(':'); })
.forEach(function (e) {
    var fn;
    eval('fn = function () { var top = this.DS.pop(); this.DS.push(' + e[1] + '); };');
    words[e[0]] = fn.bind(words);
});

// x1 x2 -- x3
'+:n+t;-:n-t;*:n*t;/:n/t;<>:t!==n;and:n&t;=:n===t;>:n>t;<:n<t;lshift:n<<t;max:Math.max(t,n);min:Math.min(t,n);mod:n%t;or:n|t;rshift:n>>t;u<:n<t;xor:n^t;nip:t;u>:n>t'
.split(';')
.map(function (e) { return e.split(':'); })
.forEach(function (e) {
    var fn;
    eval('fn = function () { var t = this.DS.pop(); var n = this.DS.pop(); this.DS.push(' + e[1] + '); };');
    words[e[0]] = fn.bind(words);
});

module.exports = words;
