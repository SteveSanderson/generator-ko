/// <reference path="./definitions/crossroads/crossroads.d.ts" />
/// <reference path="./definitions/hasher/hasher.d.ts" />

// This module configures crossroads.js, a routing library. If you prefer, you
// can use any other routing library (or none at all) as Knockout is designed to
// compose cleanly with external libraries.
//
// You *don't* have to follow the pattern established here (each route entry
// specifies a 'page', which is a Knockout component) - there's nothing built into
// Knockout that requires or even knows about this technique. It's just one of
// many possible ways of setting up client-side routes.

import ko = require("knockout");
import crossroads = require("crossroads");
import hasher = require("hasher");

var router: any = new Router({
    routes: [
        { url: '',          params: { page: 'home-page' } },
        { url: 'about',     params: { page: 'about-page' } }
    ]
});

export = router;

class Router {

    public currentRoute = ko.observable<any>({});

    constructor(config: any) {
        ko.utils.arrayForEach(config.routes, (route: any) => {
            crossroads.addRoute(route.url, (requestParams) => {
                this.currentRoute(ko.utils.extend(requestParams, route.params));
            });
        });

        this._activateCrossroads();
    }

    private _activateCrossroads(): void {
        function parseHash(newHash, oldHash) { crossroads.parse(newHash); }
        crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
        hasher.initialized.add(parseHash);
        hasher.changed.add(parseHash);
        hasher.init();
    }
}
