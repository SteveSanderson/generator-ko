define(['knockout', 'text!./<%= filename %>.html'], function(ko, templateMarkup) {

  function <%= viewModelClassName %>(params) {
    this.message = ko.observable('Hello from the <%= name %> component!');
  }

  <%= viewModelClassName %>.prototype.dispose = function() {
    // This runs when the component is torn down. Put here any logic necessary to clean up,
    // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  };
  
  return { viewModel: <%= viewModelClassName %>, template: templateMarkup };

});
