'use strict';

var colors = require('colors/safe');

exports.words = function () { // tools
    console.log(
        Object
        .keys(this)
        .map(function (word) {
            if (this[word] && this[word].immediate) {
                return colors.red(word);
            }
            return word;
        }, this)
        .join(' ')
    );
};

exports.see = function (ptr) {
    console.log(ptr.toString());
};
