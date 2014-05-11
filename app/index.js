'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var languageChoice = {
  js: 'JavaScript',
  ts: 'TypeScript'
};

var KoGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();

        // Install test dependencies too
        this.spawnCommand('bower', ['install'], { cwd: 'test' })
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
      type: 'list',
      name: 'codeLanguage',
      message: 'What language do you want to use?',
      choices: [languageChoice.js, languageChoice.ts]
    }];

    this.prompt(prompts, function (props) {
      this.longName = props.name;
      this.slugName = this._.slugify(this.longName);
      this.usesTypeScript = props.codeLanguage === languageChoice.ts;
      done();
    }.bind(this));
  },

  templating: function () {
    var excludeExtension = this.usesTypeScript ? '.js' : '.ts';
    this._processDirectory('src', 'src', excludeExtension);
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('_gulpfile.js', 'gulpfile.js');
    this.template('_gitignore', '.gitignore');
    this.copy('bowerrc', '.bowerrc');

    // Set up tests
    this._processDirectory('test', 'test', excludeExtension);
    this.copy('bowerrc_test', 'test/.bowerrc');
    this.copy('karma.conf.js');

    // Explicitly copy the .js files used by the .ts output, since they're otherwise excluded
    if (this.usesTypeScript) {
      this.copy('src/app/lib/knockout-latest.js');
      this.copy('src/app/require.config.js');
      this.copy('test/require.config.js');
    }
  },

  _processDirectory: function(source, destination, excludeExtension) {
    var root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
    var files = this.expandFiles('**', { dot: true, cwd: root }).filter(function(filename) {
      return path.extname(filename) !== excludeExtension;
    });

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