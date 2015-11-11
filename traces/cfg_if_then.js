// : foo 1 if 2 then 3 ;

{
  // <--
}

{
  ; // 1
  // <--
}

{
  L1: {
    ; // 1
    if (!dpop()) break L1; // IF ( orig: -- L1 )
    // <--
  }
}

{
  L1: {
    ; // 1
    if (!dpop()) break L1; // IF
    ; // 2
    // <--
  }
}

{
  L1: {
    ; // 1
    if (!dpop()) break L1; // IF
    ; // 2
  } // THEN  ( orig: L1 -- )
  // <--
}

{
  L1: {
    ; // 1
    if (!dpop()) break L1; // IF
    ; // 2
  } // THEN  ( orig: L1 -- )
  ; // 3
  // <--
}
