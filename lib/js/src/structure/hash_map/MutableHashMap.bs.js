'use strict';

var HashMap$WonderCommonlib = require("./HashMap.bs.js");

function set(map, key, value) {
  map[key] = value;
  return map;
}

function deleteVal(map, key) {
  map[key] = undefined;
  return map;
}

var createEmpty = HashMap$WonderCommonlib.createEmpty;

var get = HashMap$WonderCommonlib.get;

var getNullable = HashMap$WonderCommonlib.getNullable;

var has = HashMap$WonderCommonlib.has;

exports.createEmpty = createEmpty;
exports.set = set;
exports.get = get;
exports.getNullable = getNullable;
exports.has = has;
exports.deleteVal = deleteVal;
/* No side effect */
