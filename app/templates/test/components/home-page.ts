/// <reference path="../../definitions/jasmine/jasmine.d.ts" />

define(["components/home-page/home"], (homePage) => {
    var HomePageViewModel = homePage.viewModel;

    describe('Home page view model', () => {

        it('should supply a friendly message which changes when acted upon', () => {
            var instance = new HomePageViewModel();
            expect(instance.message()).toContain('Welcome to ');

            // See the message change
            instance.doSomething();
            expect(instance.message()).toContain('You invoked doSomething()');
        });

    });
});
