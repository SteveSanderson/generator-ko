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
        this.installDependencies();
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
    }];

    this.prompt(prompts, function (props) {
      this.longName = props.name;
      this.slugName = this._.slugify(this.longName);
      done();
    }.bind(this));
  },

  templating: function () {
    this._processDirectory('src', 'src')
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('_gulpfile.js', 'gulpfile.js');
    this.copy('bowerrc', '.bowerrc');
    this.copy('gitignore', '.gitignore');
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