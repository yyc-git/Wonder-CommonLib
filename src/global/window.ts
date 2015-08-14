module dyCb{
// performance.now polyfill
    declare var window;

    if ('performance' in window === false) {
        window.performance = {};
    }

// IE 8
    Date.now = ( Date.now || function () {
        return new Date().getTime();
    } );

    if ('now' in window.performance === false) {
        var offset = window.performance.timing && window.performance.timing.navigationStart ? performance.timing.navigationStart
            : Date.now();

        window.performance.now = function () {
            return Date.now() - offset;
        };
    }
}
