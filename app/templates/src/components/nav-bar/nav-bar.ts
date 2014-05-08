/// <amd-dependency path="text!./nav-bar.html" />
import ko = require("knockout");
export var template: string = require("text!./nav-bar.html");

export class viewModel {
    public route: any;

    constructor(params: any) {
        // This viewmodel doesn't do anything except pass through the 'route' parameter to the view.
        // You could remove this viewmodel entirely, and define 'nav-bar' as a template-only component.
        // But in most apps, you'll want some viewmodel logic to determine what navigation options appear.

        this.route = params.route;
    }
}
