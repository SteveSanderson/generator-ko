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

    var prompts = [];

    this.prompt(prompts, function (props) {
      this.name = 'Some Site Name';

      done();
    }.bind(this));
  },

  app: function () {
    this.directory('src');

    this.copy('_bower.json', 'bower.json');
    this.copy('_package.json', 'package.json');
    this.copy('bowerrc', '.bowerrc');
    this.copy('gitignore', '.gitignore');
    this.copy('gulpfile.js');
  }
});

module.exports = KoGenerator;