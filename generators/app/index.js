'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _s = require('underscore.string');

module.exports = yeoman.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Angular Library') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'authorName',
        message: 'Your full name:',
        validate: function (input) {
          if (/.+/.test(input)) {
            return true;
          }
          return 'Please enter your full name';
        },
        default: this.user.git.name
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: 'Your email address:',
        validate: function (input) {
          if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(input)) {
            return true;
          }
          return 'Please enter a valid email address';
        },
        default: this.user.git.email
      },
      {
        type: 'input',
        name: 'libraryName',
        message: 'Your library name (kebab-case)',
        default: _s.slugify(this.appname),
        filter: x => _s.slugify(x)
      },
      {
        type: 'input',
        name: 'gitRepositoryUrl',
        message: 'Git repository url',
        default: 'https://github.com/username/repo',
        store: true
      }
    ];

    this.prompt(prompts, function (props) {

      this.props = {

        author: {
          name: props.authorName,
          email: props.authorEmail
        },

        libraryName: {
          original: props.libraryName,
          kebabCase: props.libraryName
        },

        gitRepositoryUrl: props.gitRepositoryUrl
      };

      done();
    }.bind(this));

  },

  writing: {

    copyGitIgnore: function copyGitIgnore() {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
    },

    copyNpmIgnore: function copyNpmIgnore() {
      this.fs.copy(
        this.templatePath('npmignore'),
        this.destinationPath('.npmignore')
      );
    },

    copyTravisYml: function copyTravisYml() {
      this.fs.copy(
        this.templatePath('travis.yml'),
        this.destinationPath('.travis.yml')
      );
    },

    copySrc: function copySrc() {
      this.fs.copy(
        this.templatePath('src/**/*'),
        this.destinationPath('src')
      );
    },

    copyTypeScriptConfig: function copyTypeScriptConfig() {
      this.fs.copyTpl(
        this.templatePath('_tsconfig.json'),
        this.destinationPath('tsconfig.json'),
        {
          props: this.props
        }
      );
    },

    copyTypeScriptLintConfig: function copyTypeScriptLintConfig() {
      this.fs.copyTpl(
        this.templatePath('_tslint.json'),
        this.destinationPath('tslint.json'),
        {
          props: this.props
        }
      );
    },

    copyPackageJson: function copyPackageJson() {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          props: this.props
        }
      );
    },

    copyREADME: function copyREADME() {
      this.fs.copyTpl(
        this.templatePath('README.MD'),
        this.destinationPath('README.MD'),
        {
          props: this.props
        }
      );
    },

    copyIndex: function copyIndex() {
      this.fs.copyTpl(
        this.templatePath('index.ts'),
        this.destinationPath('index.ts'),
        {
          props: this.props
        }
      );
    }
  },

  install: function () {
    this.installDependencies({bower: false});
  }
});
