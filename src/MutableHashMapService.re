type t('a) = Js.Dict.t(Js.Nullable.t('a));

let createEmpty = HashMapService.createEmpty;

/* let set = (key: string, value, map) => {
     Js.Dict.set(map, key, value);
     map;
   }; */

let set = (key: string, value: 'a, map: t('a)): t('a) => {
  Js.Dict.set(map, key, value |> HashMapType.notNullableToNullable);

  map;
};

let get = HashMapService.get;

let unsafeGet = HashMapService.unsafeGet;

let length = HashMapService.length;

let fromList = HashMapService.fromList;

let deleteVal = (key: string, map: t('a)): t('a) =>
  set(key, Js.Nullable.undefined, map);

let has = HashMapService.has;

let entries = HashMapService.entries;

let copy = HashMapService.copy;