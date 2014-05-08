define(['knockout', 'text!./<%= filename %>.html'], function(ko, templateMarkup) {

  function <%= viewModelClassName %>(params) {
    this.message = ko.observable('Hello from the <%= name %> component!');
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  <%= viewModelClassName %>.prototype.dispose = function() { };
  
  return { viewModel: <%= viewModelClassName %>, template: templateMarkup };

});
