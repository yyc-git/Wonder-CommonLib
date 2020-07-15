type t('a) = array(Js.Nullable.t('a));
type t2('index, 'a) = t('a);

let createEmpty = SparseMapService.createEmpty;

let copy = SparseMapService.copy;

let unsafeGet = SparseMapService.unsafeGet;

let get = SparseMapService.get;

let has = SparseMapService.has;

let set = (key: int, value, map) => {
  let newMap = map |> copy;

  Array.unsafe_set(newMap, key, value |> SparseMapType.notNullableToNullable);

  newMap;
};

let deleteVal = (key: int, map) => {
  let newMap = map |> copy;

  Array.unsafe_set(newMap, key, Js.Nullable.undefined);

  newMap;
};

let isDeleted = SparseMapService.isDeleted;

let length = SparseMapService.length;

let filter = SparseMapService.filter;

let filterValid = SparseMapService.filterValid;

let getValidValues = SparseMapService.getValidValues;

let getValidKeys = SparseMapService.getValidKeys;

let getValidDataArr = SparseMapService.getValidDataArr;

let map = SparseMapService.map;

let mapValid = SparseMapService.mapValid;

let forEachValid = SparseMapService.forEachValid;

let forEachiValid = SparseMapService.forEachiValid;

let reducei = SparseMapService.reducei;

let reduceValid = SparseMapService.reduceValid;

let reduceiValid = SparseMapService.reduceiValid;

let indexOf = SparseMapService.indexOf;

let includes = SparseMapService.includes;

let mergeSparseMaps = (mapArr: array(t('a))): t('a) =>
  SparseMapService.mergeSparseMaps(set, mapArr);

let find = SparseMapService.find;