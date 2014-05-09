define(['components/home-page/home'], function(homePage) {
  var HomePageViewModel = homePage.viewModel;

  describe('Home page view model', function() {

    it('should supply a friendly message which changes when acted upon', function() {
      var instance = new HomePageViewModel();
      expect(instance.message()).toContain('Welcome to ');

      // See the message change
      instance.doSomething();
      expect(instance.message()).toContain('You invoked doSomething()');
    });

  });

});
