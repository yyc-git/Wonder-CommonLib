let createEmpty = (): Js.Dict.t(Js.Nullable.t('a)) => Js.Dict.empty();

let unsafeGet = (key: string, map) =>
  Js.Dict.unsafeGet(map, key) |> HashMapType.nullableToNotNullable;

let get = (key: string, map) => {
  let value = unsafeGet(key, map);
  NullService.isEmpty(value) ? None : Some(value);
};

let length = (map: Js.Dict.t(Js.Nullable.t('a))) =>
  Js.Array.length(Js.Dict.entries(map));

let fromList = list =>
  list |> Js.Dict.fromList |> HashMapType.dictNotNullableToDictNullable;

let has = (key: string, map) => !NullService.isEmpty(unsafeGet(key, map));

let entries = map =>
  map |> Js.Dict.entries |> HashMapType.entriesNullableToEntriesNotNullable;

let _mutableSet = (key: string, value, map) => {
  Js.Dict.set(map, key, value);
  map;
};

let _createEmpty = (): Js.Dict.t('a) => Js.Dict.empty();

let copy =
    (map: Js.Dict.t(Js.Nullable.t('a))): Js.Dict.t(Js.Nullable.t('a)) =>
  map
  |> entries
  |> ArrayUtils.reduceOneParam(
       (. newMap, (key, value)) => newMap |> _mutableSet(key, value),
       _createEmpty(),
     )
  |> HashMapType.dictNotNullableToDictNullable;