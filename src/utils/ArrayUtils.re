let reduceOneParam = (func, param, arr) => {
  let mutableParam = ref(param);
  for (i in 0 to Js.Array.length(arr) - 1) {
    mutableParam := [@bs] func(mutableParam^, Array.unsafe_get(arr, i))
  };
  mutableParam^
};
