\ 2drop	( w1 w2 -- )		core	two_drop
: 2drop
  drop drop ;

\ 2dup ( w1 w2 -- w1 w2 w1 w2 ) core two_dupe
: 2dup over over ;

\ 2over	( w1 w2 w3 w4 -- w1 w2 w3 w4 w1 w2 )	core	two_over
: 2over
  >r >r
  over over
  r>
  rot rot
  r>
  rot rot ;

\ 2swap	( w1 w2 w3 w4 -- w3 w4 w1 w2 )	core	two_swap
: 2swap
  rot >r rot r> ;

: align ;
: aligned ;
