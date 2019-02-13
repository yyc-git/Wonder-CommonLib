type t('a) = Js.Array.t('a);

[@bs.send.pipe: array('a)] external unsafePop : 'a = "pop";

[@bs.get_index] external unsafeGet : (t('a), int) => 'b = "";

[@bs.set_index] external unsafeSet : (t('a), int, 'b) => unit = "";

[@bs.send.pipe: array('a)]
external unsafeFind : ('a => [@bs.uncurry] bool) => 'a = "find";

let createEmpty = () => [||];

/* let includes = Js.Array.includes;

   let indexOf = Js.Array.indexOf;

   let length = Js.Array.length;

   let forEach = Js.Array.forEach;

   let forEachi = Js.Array.forEachi;

   let push = Js.Array.push; */
/* let pushMany = Js.Array.pushMany; */
[@bs.splice] [@bs.send.pipe: Js.Array.t('a) as 'this]
external pushMany : array('a) => int = "push";

/* let pop = Js.Array.pop;

   let concat = Js.Array.concat;

   let filter = Js.Array.filter;

   let map = Js.Array.map;

   let reduce = Js.Array.reduce; */
let flatten = (arr: array('item)) =>
  arr |> Js.Array.reduce((a, b) => Js.Array.concat(b, a), createEmpty());

/* let copy = Js.Array.copy; */
let removeDuplicateItems = arr => {
  let resultArr = [||];
  let map = MutableHashMapService.createEmpty();
  for (i in 0 to Js.Array.length(arr) - 1) {
    let item = Array.unsafe_get(arr, i);
    let key = Js.Int.toString(item);
    switch (MutableHashMapService.get(key, map)) {
    | None =>
      Js.Array.push(item, resultArr) |> ignore;
      MutableHashMapService.set(key, item, map) |> ignore;
    | Some(_) => ()
    };
  };
  resultArr;
};

let get = (index: int, arr) =>
  if (index >= Js.Array.length(arr) || index < 0) {
    None;
  } else {
    Some(Array.unsafe_get(arr, index));
  };

let isEqual = (index: int, target, arr) =>
  if (index >= Js.Array.length(arr)) {
    false;
  } else {
    Array.unsafe_get(arr, index) == target;
  };

let isNotEqual = (index: int, target, arr) =>
  if (index >= Js.Array.length(arr)) {
    true;
  } else {
    Array.unsafe_get(arr, index) != target;
  };

let forEach = (func, arr) => {
  for (i in 0 to Js.Array.length(arr) - 1) {
    func(. Array.unsafe_get(arr, i)) |> ignore;
  };
  ();
};

let forEachi = (func, arr) => {
  for (i in 0 to Js.Array.length(arr) - 1) {
    func(. Array.unsafe_get(arr, i), i) |> ignore;
  };
  ();
};

let range = (a: int, b: int) => {
  let result = createEmpty();
  for (i in a to b) {
    Js.Array.push(i, result) |> ignore;
  };
  result;
};

let reduceOneParam = ArrayUtils.reduceOneParam;

let reduceOneParami = (func, param, arr) => {
  let mutableParam = ref(param);
  for (i in 0 to Js.Array.length(arr) - 1) {
    mutableParam := func(. mutableParam^, Array.unsafe_get(arr, i), i);
  };
  mutableParam^;
};