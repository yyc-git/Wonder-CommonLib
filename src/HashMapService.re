let createEmpty = () => Js.Dict.empty();

let get = (key: string, map) => Js.Dict.get(map, key);

let unsafeGet = (key: string, map) => Js.Dict.unsafeGet(map, key);

let length = map => Js.Array.length(Js.Dict.entries(map));

let fromList = Js.Dict.fromList;

let has = (key: string, map) => map |> get(key) |> Js.Option.isSome;

let entries = Js.Dict.entries;

let _mutableSet = (key: string, value, map) => {
  Js.Dict.set(map, key, value);
  map;
};

let copy = map =>
  map
  |> entries
  |> ArrayUtils.reduceOneParam(
       (. newMap, (key, value)) => newMap |> _mutableSet(key, value),
       createEmpty(),
     );