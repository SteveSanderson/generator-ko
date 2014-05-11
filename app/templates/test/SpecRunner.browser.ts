module main {
    // Reference your test modules here
    var testModules = [
        'components/home-page'
    ];

    // After the 'jasmine-boot' module creates the Jasmine environment, load all test modules then run them
    require(['jasmine-boot'], function () {
        require(testModules.map(m => '../test/' + m), window.onload);
    });
}
