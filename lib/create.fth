: ] 0 STATE ! ;
: [ -1 STATE ! ; IMMEDIATE
: CREATE ??? ;
: DOES> ??? ; IMMEDIATE
: POSTPONE ' LITERAL ['] , LITERAL ; IMMEDIATE \ : POSTPONE ' , ; IMMEDIATE
: : CREATE ] DOES> doLIST ;
: ; POSTPONE EXIT REVEAL POSTPONE [ ; IMMEDIATE
: VARIABLE CREATE 0 , ;
: CONSTANT CREATE , DOES> @ ;

: LITERAL POSTPONE (LITERAL) , ; IMMEDIATE
: DO POSTPONE 2>R HERE ; IMMEDIATE

: [char] ?comp char postpone literal ; immediate
\ : [char] char state @ if literal then ; immediate \ state-smart version
: ['] ?comp ' postpone literal ; immediate
\ : ['] ' state @ if postpone literal then ; immediate \ state-smart version
