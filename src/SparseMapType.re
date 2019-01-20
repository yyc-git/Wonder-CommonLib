external nullableToNotNullable : Js.Nullable.t('a) => 'a = "%identity";

external notNullableToNullable : 'a => Js.Nullable.t('a) = "%identity";

external arrayNullableToArrayNotNullable :
  array(Js.Nullable.t('a)) => array('a) =
  "%identity";