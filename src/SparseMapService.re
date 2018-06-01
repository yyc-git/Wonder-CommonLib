type t('a) = array('a);

let createEmpty = () => [||];

let unsafeGet = (key: int, map) => Array.unsafe_get(map, key);

let get = (key: int, map) => {
  let value = unsafeGet(key, map);
  NullService.isEmpty(value) ? None : Some(value);
};

let has = (key: int, map) => ! NullService.isEmpty(unsafeGet(key, map));

let set = (key: int, value, map) => {
  Array.unsafe_set(map, key, value);
  map;
};

let deleteVal = (key: int, map) => {
  Array.unsafe_set(map, key, Js.Nullable.undefined);
  map;
};