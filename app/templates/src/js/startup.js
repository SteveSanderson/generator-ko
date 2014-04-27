define(['jquery', 'knockout', 'js/router', 'bootstrap'], function($, ko, router) {

  // Components can be packaged as AMD modules, such as the following:
  ko.components.register('nav-bar', { require: 'components/controls/navBar/navBar' });
  ko.components.register('home-page', { require: 'components/pages/home/home' });

  // ... or for template-only components, you can just point to a .html file directly:
  ko.components.register('about-page', {
    template: { require: 'text!components/pages/about/about.html' }
  });

  // Start the application
  ko.applyBindings({ route: router.currentRoute });
});
