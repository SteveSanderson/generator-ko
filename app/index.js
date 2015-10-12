'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var KoGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        // Figure out whether we have an internet connection. If not, need to
        // pass --offline to bower otherwise it won't fall back on cache.
        require('dns').resolve('example.com', function(isOffline) {
          console.log('Installing dependencies in ' + (isOffline ? 'offline' : 'online') + ' mode...');
          if (isOffline) {
            // Patch bowerInstall to pass --offline
            this.bowerInstall = (function(originalFunction) {
              return function(paths, options, cb) {
                options = options || {};
                options.offline = true;
                return originalFunction.call(this, paths, options, cb);
              };
            })(this.bowerInstall);
          }

          this.installDependencies();

          if (this.includeTests) {
            // Install test dependencies too
            var bowerArgs = ['install'];
            if (isOffline) {
              bowerArgs.push('--offline');
            }
            this.spawnCommand('bower', bowerArgs, { cwd: 'test' });
          }
        }.bind(this));
      }
    });
  },

  askFor: function () {
    var done = this.async();
    this.log(this.yeoman);
    this.log(chalk.magenta('You\'re using the fantastic Knockout app generator.'));

    var prompts = [{
      name: 'name',
      message: 'What\'s the name of your new site?',
      default: path.basename(process.cwd())
    }, {
      type: 'confirm',
      name: 'includeTests',
      message: 'Do you want to include automated tests, using Jasmine and Karma?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.longName = props.name;
      this.slugName = this._.slugify(this.longName);
      this.includeTests = props.includeTests;
      done();
    }.bind(this));
  },

  templating: function () {
    this._processDirectory('src', 'src');
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('_gulpfile.js', 'gulpfile.js');
    this.template('_gitignore', '.gitignore');
    this.copy('bowerrc', '.bowerrc');
    this.copy('jsconfig.json');

    if (this.includeTests) {
      // Set up tests
      this._processDirectory('test', 'test');
      this.copy('bowerrc_test', 'test/.bowerrc');
      this.copy('karma.conf.js');
    }
  },

  _processDirectory: function(source, destination) {
    var root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
    var files = this.expandFiles('**', { dot: true, cwd: root });

    for (var i = 0; i < files.length; i++) {
        var f = files[i];
        var src = path.join(root, f);
        if(path.basename(f).indexOf('_') == 0){
            var dest = path.join(destination, path.dirname(f), path.basename(f).replace(/^_/, ''));
            this.template(src, dest);
        }
        else{
            var dest = path.join(destination, f);
            this.copy(src, dest);
        }
    }
  }
});

module.exports = KoGenerator;