/// <amd-dependency path="text!./home.html" />
import ko = require("knockout");
export var template: string = require("text!./home.html");

export class viewModel {
    public message = ko.observable("Welcome to <%= longName.replace('"', '\\"') %>!");

    public doSomething() {
        this.message('You invoked doSomething() on the viewmodel.');
    }

    public dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}
