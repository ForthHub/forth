# create
> /krēˈāt/

> _verb_

> bring (something) into existence.

## C.5.1 The Forth dictionary
A Forth program is organized into a dictionary :scissors:. This dictionary is a threaded list of variable-length items, each of which defines a word. The content of each definition depends upon the type of word (data item, constant, sequence of operations, etc.). The dictionary is extensible, usually growing toward high memory. :scissors: . Words are added to the dictionary by "defining words", of which the most commonly used is `:` (colon). When `:` is executed, it constructs a definition for the word that follows it. In classical implementations, the content of this definition is a string of addresses of previously defined words which will be executed in turn whenever the word being defined is invoked. The definition is terminated by `;` (semicolon). :scissors:

## E.4.1 Definitions
Traditionally, Forth definitions have consisted of the name of the Forth word, a dictionary search link, data describing how to execute the definition, and parameters describing the definition itself. These components are called the `name`, `link`, `code`, and `parameter` fields. **No method for accessing these fields has been found that works across all of the Forth implementations currently in use.** Therefore, ANS Forth severely restricts how the fields may be used. Specifically, a portable ANS Forth program may not use the `name`, `link`, or `code` field in any way. Use of the parameter field (renamed to data field for clarity) is limited to the operations described below.

Only words defined with `CREATE` or with other defining words that call `CREATE` have data fields. The other defining words in the Standard (`VARIABLE`, `CONSTANT`, :, etc.) might not be implemented with CREATE. Consequently, a Standard Program must assume that words defined by VARIABLE, CONSTANT, : , etc., may have no data fields. There is no way for a Standard Program to modify the value of a constant or to change the meaning of a colon definition. The `DOES>` part of a defining word operates on a `data` field. Since only `CREATEd` words have data fields, `DOES>` can only be paired with `CREATE` or words that call `CREATE`.

In ANS Forth, `FIND`, `[']` and `'` (tick) return an unspecified entity called an "execution token". There are only a few things that may be done with an execution token. The token may be passed to `EXECUTE` to execute the word ticked or compiled into the current definition with `COMPILE,`. The token can also be stored in a variable and used later. Finally, if the word ticked was defined via `CREATE`, `>BODY` converts the execution token into the word's data-field address.

One thing that definitely cannot be done with an execution token is use `!` or `,` to store it into the object code of a Forth definition. This technique is sometimes used in implementations where the object code is a list of addresses (threaded code) and an execution token is also an address. However, ANS Forth permits native code implementations where this will not work.

Forth has words to create other words.

word        | _name | Iterpretation | Compilation   | RunTime     | def | spec
----------- | ----- | ------------- | ------------- | ----------- | --- | --------
`'`         |       |               |               | _name -- xt |     | core
`:`         |       | _name =>      |               |             | new | core
`;`         |       |               | <=            |             | add | core
`>body`     |       |               |               | xt -- addr  | add | core
`abort`     |       |               | <=            |             |     | core
`abort"`    |       |               | <=            |             |     | core
`constant`  | yes   | yes           |               |             | new | core
`create`    | yes   | yes           | yes           |             | new | core
`does>`     |       |               |               |             | add | core
`evaluate`  |       | str --        | str --        |             |     | core
`execute`   |       |               |               |             |     | core
`find`      |       | str -- -1,0,1 | str -- -1,0,1 |             |     | core
`immediate` |       |               |               |             |     | core
`literal`   |       |               | n --          | -- n        | add | core
`postpone`  |       |               | _name         |             | add | core
`quit`      |       |               | <=            |             |     | core
`recurse`   |       |               | yes           |             | add | core
`variable`  | yes   | yes           |               |             | new | core
`[`         |       |               | <=            |             |     | core
`[']`       |       |               | _name         | -- xt       |     | core
`[char]`    |       |               | _name         | -- char     |     | core
`]`         |       | =>            |               |             |     | core
`:noname`   |       | =>            |               |             | new | core ext
`compile,`  |       |               | xt --         |             |     | core ext
`[compile]` |       |               | _name --      |             |     | core ext
