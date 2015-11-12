// : foo 1 begin 2 until 3 ;

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
  } while(!dpop()); // UNTIL
  // <--
}

{
  ; // 1
  L1: do { // BEGIN
    ; // 2
  } while(!dpop()); // UNTIL
  ; // 3
  // <--
}
