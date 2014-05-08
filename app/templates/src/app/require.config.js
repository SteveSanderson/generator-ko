// require.js looks for the following global when initializing
var require = {
    baseUrl: ".",
    paths: {
        "text":         "bower_modules/requirejs-text/text",
        "jquery":       "bower_modules/jquery/dist/jquery",
        "bootstrap":    "bower_modules/components-bootstrap/js/bootstrap.min",
        "crossroads":   "bower_modules/crossroads/dist/crossroads.min",
        "hasher":       "bower_modules/hasher/dist/js/hasher.min",
        "signals":      "bower_modules/js-signals/dist/signals.min",

        // TODO: Use Bower for these
        "knockout": "app/lib/knockout-latest"
    },
    shim: {
        "bootstrap": { deps: ["jquery"] }
    }
};
