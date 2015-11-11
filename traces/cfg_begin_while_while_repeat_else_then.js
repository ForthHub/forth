// : foo 1 begin 2 while 3 while 4 repeat 5 else 6 then 7 ;

{
  // <--
}

{
  ; // 1
  // <--
}

{
  ; // 1
  L1: do { // BEGIN
    // <--
  } while(true);
}

{
  ; // 1
  L1: do { // BEGIN
    ; // 2
    // <--
  } while(true);
}

{
  ; // 1
  L1: do { // BEGIN
    ; // 2
    if(!dpop()) break L2; // WHILE  ( orig: --  L2 )
    // <--
  } while(true);
}

{
  ; // 1
  L1: do { // BEGIN
    ; // 2
    if(!dpop()) break L2; // WHILE
    ; // 3
    // <--
  } while(true);
}

{
  ; // 1
  L1: do { // BEGIN
    ; // 2
    if(!dpop()) break L2; // WHILE
    ; // 3
    if(!dpop()) break L3; // WHILE  ( orig: L2 -- L2 L3 )
    // <--
  } while(true);
}

{
  ; // 1
  L1: do { // BEGIN
    ; // 2
    if(dpop()) break L2; // WHILE
    ; // 3
    if(dpop()) break L3; // WHILE
    ; // 4
    // <--
  } while(true);
}

{
  ; // 1
  ??: {
    L3: do { // BEGIN
      ; // 2
      if(dpop()) break L2; // WHILE
      ; // 3
      if(dpop()) break L3; // WHILE
      ; // 4
    } while(true); // REPEAT  ( orig: L2 L3 -- L2 )
    // <--
  }
}

{
  ; // 1
  ??: {
    L3: do { // BEGIN
      ; // 2
      if(dpop()) break L2; // WHILE
      ; // 3
      if(dpop()) break L3; // WHILE
      ; // 4
    } while (true) // REPEAT
    ; // 5
    // <--
  }
}

{
  ; // 1
  L4: {
    L2: {
      L3: do { // BEGIN
        ; // 2
        if(dpop()) break L2; // WHILE
        ; // 3
        if(dpop()) break L3; // WHILE
        ; // 4
      } while (true) // REPEAT
      ; // 5
      break L4; // ELSE  ( orig: L2 -- L4 )
    }
    // <--
  }
}

{
  ; // 1
  L4: {
    L2: {
      L3: do { // BEGIN
        ; // 2
        if(dpop()) break L2; // WHILE
        ; // 3
        if(dpop()) break L3; // WHILE
        ; // 4
      } while (true) // REPEAT
      ; // 5
      break L4; // ELSE
    }
    ; // 6
    // <--
  }
}

{
  ; // 1
  L4: {
    L2: {
      L3: do { // BEGIN
        ; // 2
        if(dpop()) break L2; // WHILE
        ; // 3
        if(dpop()) break L3; // WHILE
        ; // 4
      } while (true) // REPEAT
      ; // 5
      break L4; // ELSE
    }
    ; // 6
  } // THEN  ( orig: L4 -- )
  // <--
}

{
  ; // 1
  L4: {
    L2: {
      L3: do { // BEGIN
        ; // 2
        if(dpop()) break L2; // WHILE
        ; // 3
        if(dpop()) break L3; // WHILE
        ; // 4
      } while (true) // REPEAT
      ; // 5
      break L4; // ELSE
    }
    ; // 6
  } // THEN
  ; // 7
  // <--
}
