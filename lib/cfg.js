'use strict';

// control-flow words

exports['+loop'] = function () {};
exports['+loop'].immediate = true;

exports[';'] = function () {};
exports[';'].immediate = true;

exports.begin = function () {};
exports.begin.immediate = true;

exports.do = function () {};
exports.do.immediate = true;

exports['does>'] = function () {};
exports['does>'].immediate = true;

//  : ELSE ( orig1 -- orig2 / -- )
//      \ resolve IF supplying alternate execution
//      POSTPONE AHEAD  \ unconditional forward branch orig2
//      1 CS-ROLL       \ put orig1 back on top
//      POSTPONE THEN   \ resolve forward branch from orig1
//  ; IMMEDIATE

exports.else = function () {};
exports.else.immediate = true;

exports.if = function () {};
exports.if.immediate = true;

exports.loop = function () {};
exports.loop.immediate = true;

//  : REPEAT ( orig dest -- / -- )
//      \ resolve a single WHILE and return to BEGIN
//      POSTPONE AGAIN  \ uncond. backward branch to dest
//      POSTPONE THEN   \ resolve forward branch from orig
//  ; IMMEDIATE

exports.repeat = function () {};
exports.repeat.immediate = true;

exports.then = function () {};
exports.then.immediate = true;

exports.until = function () {};
exports.until.immediate = true;

//  : WHILE ( dest -- orig dest / flag -- )
//      \ conditional exit from loops
//      POSTPONE IF     \ conditional forward brach
//      1 CS-ROLL       \ keep dest on top
//  ; IMMEDIATE

exports.while = function () {};
exports.while.immediate = true;

// AHEAD    mark origin of forward unconditional branch
// CS-PICK  copy item on control-flow stack
// CS-ROLL  reorder items on control-flow stack
