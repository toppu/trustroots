'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    fs = require('fs'),
    defaultAssets = require('./config/assets/default'),
    productionAssets = require('./config/assets/production'),
    testAssets = require('./config/assets/test');

module.exports = function (grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      test: {
        NODE_ENV: 'test'
      },
      dev: {
        NODE_ENV: 'development'
      },
      prod: {
        NODE_ENV: 'production'
      }
    },
    watch: {
      serverViews: {
        files: defaultAssets.server.views,
        options: {
          livereload: true
        }
      },
      serverJS: {
        files: defaultAssets.server.allJS,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      clientViews: {
        files: defaultAssets.client.views,
        options: {
          livereload: true
        }
      },
      clientJS: {
        files: defaultAssets.client.js,
        tasks: ['jshint', 'ngAnnotate:production'],
        options: {
          livereload: true
        }
      },
      clientCSS: {
        files: defaultAssets.client.css,
        tasks: [], //'csslint'
        options: {
          livereload: true
        }
      },
      clientLESS: {
        files: defaultAssets.client.less,
        tasks: ['less'],//'csslint'
        options: {
          livereload: false
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js,html',
          watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
        }
      }
    },
    concurrent: {
      default: ['nodemon', 'watch'],
      debug: ['nodemon', 'watch', 'node-inspector'],
      options: {
        logConcurrentOutput: true
      }
    },
    jshint: {
      all: {
        src: _.union(defaultAssets.server.allJS, defaultAssets.client.js, testAssets.tests.server, testAssets.tests.client, testAssets.tests.e2e),
        options: {
          jshintrc: true,
          node: true,
          mocha: true,
          jasmine: true
        }
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      all: {
        src: defaultAssets.client.css
      }
    },
    ngAnnotate: {
      production: {
        options: {
          singleQuotes: true,
          add: true,
          //separator: ';'
        },
        files: {
          'public/dist/application.js': defaultAssets.client.js //to:from
        }
      },
      development: {
        options: {
          singleQuotes: true,
          add: true,
          //separator: ';'
        },
        files: {
          'public/dist/application.js': defaultAssets.client.js //to:from
        }
      }
    },
    uglify: {
      annotated: {
        options: {
          separator: '\n',
          mangle: false
        },
        files: {
          'public/dist/application.js': 'public/dist/application.js' //to:from
        }
      },
      bundle: {
        options: {
          separator: '\n',
          mangle: false
        },
        files: {
          'public/dist/application.min.js': 'public/dist/application.min.js' //to:from
        }
      }
    },
    concat: {
      options: {
        separator: '\n',
        stripBanners: true
      },
      libs: {
        src: _.union(productionAssets.client.lib.js, ['public/dist/application.js']),//config.files.client.lib.js
        dest: 'public/dist/application.min.js'
      }
    },
    less: {
      dist: {
        files: [{
          expand: true,
          src: defaultAssets.client.lessSrc,
          ext: '.css',
          rename: function(base, src) {
            return  src.replace('/less/', '/css/');
          }
        }]
      }
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer-core')({
            browsers: ['last 2 versions']
          })
        ]
      },
      dist: {
        src: defaultAssets.client.css
      }
    },
    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      dist: {
        files: {
          'public/dist/application.min.css': _.union(defaultAssets.client.css, productionAssets.client.lib.css)
        }
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'preload': false,
          'stack-trace-limit': 50,
          'hidden': []
        }
      }
    },
    copy: {
      localConfig: {
        src: 'config/env/local.sample.js',
        dest: 'config/env/local.js',
        filter: function() {
          return !fs.existsSync('config/env/local.js');
        }
      }
    },
    mochaTest: {
      src: testAssets.tests.server,
      options: {
        reporter: 'spec'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    shell: {
      'swagger-ui': {
        command: [
          'mkdir -p ./tmp',
          'rm -fr ./tmp/swagger-ui-master',
          'wget -nv -O ./tmp/swagger-ui.zip  https://github.com/swagger-api/swagger-ui/archive/master.zip',
          'unzip -q ./tmp/swagger-ui.zip -d ./tmp',
          'rm -fr ./public/developers/api',
          'mkdir -p ./public/developers/api',
          'mv ./tmp/swagger-ui-master/dist/* ./public/developers/api',
          'sed -i "" "s!http://petstore\.swagger\.io/v2!/developers!g" ./public/developers/api/index.html',
          'sed -i "" "s!url: url,!url: url, validatorUrl:null,!g" ./public/developers/api/index.html',
          'rm -fr ./tmp/swagger-ui-master'
        ].join('&&')
      },
      'fontello': {
        command: 'fontello-cli install --config ./fontello.json --css ./public/lib/fontello/css --font ./public/lib/fontello/fonts'
      },
      'selenium': {
        command: 'python ./scripts/selenium/test.py'
      }
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt);

  // Connect to the MongoDB instance and load the models
  grunt.task.registerTask('mongoose', 'Task that connects to the MongoDB instance and loads the application models.', function() {
    // Get the callback
    var done = this.async();

    // Use mongoose configuration
    var mongoose = require('./config/lib/mongoose.js');

    // Connect to database
    mongoose.connect(function(db) {
      done();
    });
  });

  // Lint CSS and JavaScript files.
  // @todo: Until ignoring bootstrap works in CSSLint, you gotta do lintin css manually
  grunt.registerTask('lint', ['jshint']); //'less', 'csslint'

  // Lint project files and minify them into two production files.
  grunt.registerTask('build', ['copy:localConfig', 'shell:fontello', 'ngAnnotate:production', 'uglify:annotated', 'concat:libs', 'uglify:bundle', 'less', 'postcss', 'cssmin']);

  // Run the project tests
  grunt.registerTask('test', ['env:test', 'copy:localConfig', 'lint', 'mongoose', 'mochaTest', 'karma:unit']);
  grunt.registerTask('test:server', ['env:test', 'copy:localConfig', 'lint', 'mongoose', 'mochaTest']);
  grunt.registerTask('test:client', ['env:test', 'copy:localConfig', 'lint', 'mongoose', 'karma:unit']);
  grunt.registerTask('test:selenium', ['shell:selenium']); // Not included in the main test task!

  // Produce font icon
  grunt.registerTask('fontello', ['shell:fontello']);

  // Produce documentation
  grunt.registerTask('docs', ['shell:swagger-ui']);

  // Run the project in development mode
  grunt.registerTask('default', ['env:dev', 'copy:localConfig', 'lint', 'ngAnnotate:development', 'less', 'postcss', 'concurrent:default']);

  // Run the project in debug mode (same as default but with node-inspector)
  grunt.registerTask('debug', ['env:dev', 'copy:localConfig', 'lint', 'ngAnnotate:development', 'less', 'postcss', 'concurrent:debug']);

  // Run the project in production mode
  grunt.registerTask('prod', ['env:prod', 'lint', 'build', 'concurrent:default']);
};
