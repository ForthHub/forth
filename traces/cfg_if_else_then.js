// : foo 1 if 2 else 3 then 4 ;

{
  // <--
}

{
  ; // 1
  // <--
}

{
  ; // 1
  L1: {
    if (!dpop()) break L1; // IF ( orig: -- L1 )
    // <--
  }
}

{
  ; // 1
  L1: {
    if (!dpop()) break L1; // IF
    ; // 2
    // <--
  }
}

{
  ; // 1
  L2: {
    L1: {
      if (!dpop()) break L1; // IF
      ; // 2
      break L2; // ELSE  ( orig: L1 -- L2 )
    }
    // <--
  }
}

{
  L2: {
    L1: {
      ; // 1
      if (!dpop()) break L1; // IF
      ; // 2
      break L2; // ELSE
    }
    ; // 3
    // <--
  }
}

{
  L2: {
    L1: {
      ; // 1
      if (!dpop()) break L1; // IF
      ; // 2
      break L2; // ELSE
    }
    ; // 3
  } // THEN ( orig: L2 -- )
  // <--
}

{
  L2: {
    L1: {
      ; // 1
      if (!dpop()) break L1; // IF
      ; // 2
      break L2; // ELSE
    }
    ; // 3
  } // THEN
  ; // 4
  // <--
}
