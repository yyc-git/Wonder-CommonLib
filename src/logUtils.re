[@bs.val] external console : 'console = "";

[@bs.val] [@bs.scope "console"] external warn : string => unit = "warn";

let log = (message: string) => Js.log(message);