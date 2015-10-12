import ko from 'knockout';
import crossroads from 'crossroads';
import hasher from 'hasher';

// This module configures crossroads.js, a routing library. If you prefer, you
// can use any other routing library (or none at all) as Knockout is designed to
// compose cleanly with external libraries.
//
// You *don't* have to follow the pattern established here (each route entry
// specifies a 'page', which is a Knockout component) - there's nothing built into
// Knockout that requires or even knows about this technique. It's just one of
// many possible ways of setting up client-side routes.

class Router {
    constructor(config) {
        this.currentRoute = ko.observable({});
    
        // Configure Crossroads route handlers
        ko.utils.arrayForEach(config.routes, (route) => {
            crossroads.addRoute(route.url, (requestParams) => {
                this.currentRoute(ko.utils.extend(requestParams, route.params));
            });
        });
    
        // Activate Crossroads
        crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
        hasher.initialized.add(hash => crossroads.parse(hash));
        hasher.changed.add(hash => crossroads.parse(hash));
        hasher.init();
    }
}

// Create and export router instance
var routerInstance = new Router({
    routes: [
        { url: '',          params: { page: 'home-page' } },
        { url: 'about',     params: { page: 'about-page' } }
    ]
});

export default routerInstance;
