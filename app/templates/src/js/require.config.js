// require.js looks for the following global when initializing
var require = {
    baseUrl: ".",
    paths: {
        "text":         "bower_components/requirejs-text/text",
        "jquery":       "bower_components/jquery/dist/jquery",
        "bootstrap":    "bower_components/components-bootstrap/js/bootstrap.min",
        "crossroads":   "bower_components/crossroads/dist/crossroads.min",
        "hasher":       "bower_components/hasher/dist/js/hasher.min",
        "signals":      "bower_components/js-signals/dist/signals.min",

        // TODO: Use Bower for these
        "knockout": "js/lib/knockout-latest",
        "knockout-customElements": "js/lib/knockout-customElements",
    },
    shim: {
        "bootstrap": { deps: ["jquery"] }
    }
};
