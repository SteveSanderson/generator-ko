declare var __karma__: any;
declare var requirejs: any;

var tests = [];
for (var file in __karma__.files) {
  if (__karma__.files.hasOwnProperty(file)) {
    if (/test\/components\/.*\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    baseUrl: '/base/src',
    deps: tests,
    callback: __karma__.start
});
