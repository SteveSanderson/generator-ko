'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var fs = require('fs');

var ComponentGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    console.log('Creating component \'' + this.name + '\'...');
    this.componentName = this.name;
    this.dirname = 'src/components/' + this._.dasherize(this.name) + '/';
    this.filename = this._.dasherize(this.name);
    this.viewModelClassName = this._.classify(this.name);
  },

  template: function () {
    this.copy('view.html', this.dirname + this.filename + '.html');
    this.copy('viewmodel.js', this.dirname + this.filename + '.js');
  },

  addComponentRegistration: function() {
  	var startupFile = 'src/js/startup.js';
  	readIfFileExists.call(this, startupFile, function(existingContents) {
  		var existingRegistrationRegex = new RegExp('\\bko\\.components\\.register\\(\s*[\'"]' + this.filename + '[\'"]');
  		if (existingRegistrationRegex.exec(existingContents)) {
  			console.log('\'' + this.filename + '\' is already registered in ' + startupFile);
  			return;
  		}

  		var token = '// [Scaffolded component registrations will be inserted here. To retain this feature, don\'t remove this comment.]',
  			regex = new RegExp('^(\\s*)(' + token.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + ')', 'm'),
			lineToAdd = 'ko.components.register(\'' + this.filename + '\', { require: \'components/' + this.filename + '/' + this.filename + '\' });',
			newContents = existingContents.replace(regex, '$1' + lineToAdd + '\n$&');
		fs.writeFile(startupFile, newContents);
		console.log('\'' + this.filename + '\' registered in ' + startupFile);
  	});
  }
});

function readIfFileExists(path, callback) {
	var contents;
	try {
		contents = this.readFileAsString(path);
	} catch(ex) {
		return;
	}
	callback.call(this, contents);
}

module.exports = ComponentGenerator;
