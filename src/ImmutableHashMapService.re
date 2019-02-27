type t('a) = Js.Dict.t('a);

let createEmpty = HashMapService.createEmpty;

let set = (key: string, value, map) => {
  let newMap = map |> HashMapService.copy;

  Js.Dict.set(newMap, key, value);

  newMap;
};

let get = HashMapService.get;

let unsafeGet = HashMapService.unsafeGet;

let length = HashMapService.length;

let fromList = HashMapService.fromList;

let deleteVal = (key: string, map) =>
  set(key, Js.Nullable.undefined, map |> HashMapService.copy);

let has = HashMapService.has;

let entries = HashMapService.entries;

let copy = HashMapService.copy;