define(['jquery', 'knockout', 'js/router', 'bootstrap'], function($, ko, router) {

  // Preregisters components, specifying where the viewmodels and templates can be found for each.
  // This also makes them available as custom elements, e.g., <nav-bar></nav-bar>
  // Learn more: http://knockoutjs.com/documentation/TODO
  ko.components.register('nav-bar', { require: 'components/controls/navBar/navBar' });
  ko.components.register('home-page', { require: 'components/pages/home/home' });
  ko.components.register('about-page', {
    template: { require: 'text!components/pages/about/about.html' }
  });

  // Start the application
  ko.applyBindings({ route: router.currentRoute });
});
