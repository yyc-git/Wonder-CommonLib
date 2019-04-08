let createEmpty = (): array(Js.Nullable.t('a)) => [||];

let copy = Js.Array.copy;

let unsafeGet = (key: int, map: array(Js.Nullable.t('a))): 'a =>
  Array.unsafe_get(map, key) |> SparseMapType.nullableToNotNullable;

/* Js.Nullable.iter(Array.unsafe_get(map, key), (. value) => value); */
/* Js.Nullable.return(Array.unsafe_get(map, key)); */

let get = (key: int, map) => {
  let value = unsafeGet(key, map);
  NullService.isEmpty(value) ? None : Some(value);
};

let has = (key: int, map) => !NullService.isEmpty(unsafeGet(key, map));
/* get(key, map) |> Js.Option.isSome; */

/* ! NullService.isEmpty(unsafeGet(key, map)); */

let isDeleted = item => item |> Js.Nullable.test;

let length = Js.Array.length;

/* let getFirst = map =>
   map |> length === 0 ? None : Some(Array.unsafe_get(map, 0)); */

let filter = Js.Array.filter;

let filterValid = (func, map) =>
  map
  |> Js.Array.filter(value =>
       NullService.isInMap(value)
       && func(. value |> SparseMapType.nullableToNotNullable)
     );

let getValidValues = map =>
  map
  |> Js.Array.filter(value => NullService.isInMap(value))
  |> SparseMapType.arrayNullableToArrayNotNullable;

let getValidKeys = map =>
  map
  |> ArrayService.reduceOneParami(
       (. arr, value, key) =>
         if (NullService.isNotInMap(value)) {
           arr;
         } else {
           arr |> Js.Array.push(key) |> ignore;
           arr;
         },
       [||],
     );

let map =
    (
      func: (. Js.Nullable.t('a)) => Js.Nullable.t('b),
      map: array(Js.Nullable.t('a)),
    )
    : array(Js.Nullable.t('b)) =>
  map |> Js.Array.map(value => func(. value));

let mapValid = (func, map) =>
  map
  |> Js.Array.map(value =>
       if (NullService.isNotInMap(value)) {
         Js.Nullable.undefined;
       } else {
         func(. value |> SparseMapType.nullableToNotNullable)
         |> SparseMapType.notNullableToNullable;
       }
     );

let forEachValid = (func, map) =>
  map
  |> ArrayService.forEach((. value) =>
       if (NullService.isNotInMap(value)) {
         ();
       } else {
         func(. value |> SparseMapType.nullableToNotNullable);
       }
     );

let forEachiValid = (func, map) =>
  map
  |> ArrayService.forEachi((. value, index) =>
       if (NullService.isNotInMap(value)) {
         ();
       } else {
         func(. value |> SparseMapType.nullableToNotNullable, index);
       }
     );

let reducei = ArrayService.reduceOneParami;

let reduceValid = (func, initValue, map) =>
  map
  |> ArrayService.reduceOneParam(
       (. previousValue, value) =>
         if (NullService.isNotInMap(value)) {
           previousValue;
         } else {
           func(.
             previousValue |> SparseMapType.nullableToNotNullable,
             value |> SparseMapType.nullableToNotNullable,
           )
           |> SparseMapType.notNullableToNullable;
         },
       initValue |> SparseMapType.notNullableToNullable,
     )
  |> SparseMapType.nullableToNotNullable;

let reduceiValid = (func, initValue, map) =>
  map
  |> ArrayService.reduceOneParami(
       (. previousValue, value, index) =>
         if (NullService.isNotInMap(value)) {
           previousValue;
         } else {
           func(.
             previousValue |> SparseMapType.nullableToNotNullable,
             value |> SparseMapType.nullableToNotNullable,
             index,
           )
           |> SparseMapType.notNullableToNullable;
         },
       initValue |> SparseMapType.notNullableToNullable,
     )
  |> SparseMapType.nullableToNotNullable;

let indexOf = (targetValue, map) =>
  map |> Js.Array.indexOf(targetValue |> SparseMapType.notNullableToNullable);

let includes = (targetValue, map) =>
  map
  |> SparseMapType.arrayNullableToArrayNotNullable
  |> Js.Array.includes(targetValue);

let mergeSparseMaps = (setFunc, mapArr) =>
  mapArr
  |> ArrayService.reduceOneParam(
       (. resultMap, map) =>
         map
         |> reduceiValid(
              (. resultMap, value, key) => resultMap |> setFunc(key, value),
              resultMap,
            ),
       createEmpty(),
     );

let find = (func, map) =>
  Js.Array.find(func, map |> SparseMapType.arrayNullableToArrayNotNullable);

let getValidDataArr = map =>
  map
  |> reduceiValid(
       (. arr, value, key) => {
         arr |> Js.Array.push((key, value)) |> ignore;
         arr;
       },
       [||],
     );