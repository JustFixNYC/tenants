'use strict';

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverViews: ['app/views/**/*.*'],
		serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
		serverSASS: ['app/styles/{,*/}*.{scss,sass}'],
		//serverSASS: ['app/styles/{,*/}*.{scss,sass}', '!app/styles/bootstrap-config.scss'],
		clientViews: ['public/modules/**/views/**/*.html'],
		clientJS: ['public/js/*.js', 'public/modules/**/*.js'],
		clientCSS: ['public/styles/*.css', '!public/styles/bootstrap.css'],
		mochaTests: ['app/tests/**/*.js']
	};

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			serverViews: {
				files: watchFiles.serverViews,
				options: {
					livereload: true
				}
			},
			serverJS: {
				files: watchFiles.serverJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			serverSASS: {
			    files: watchFiles.serverSASS,
			    tasks: ['sass:dev'],
			    options: {
						livereload: true
					}
			},
			clientViews: {
				files: watchFiles.clientViews,
				options: {
					livereload: true,
				}
			},
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			} //,
			// clientCSS: {
			// 	files: watchFiles.clientCSS,
			// 	tasks: ['csslint'],
			// 	options: {
			// 		livereload: true
			// 	}
			// }
		},
		jshint: {
			all: {
				src: watchFiles.clientJS.concat(watchFiles.serverJS),
				options: {
					jshintrc: true
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc',
			},
			all: {
				src: watchFiles.clientCSS
			}
		},
		uglify: {
			production: {
				options: {
					mangle: false
				},
				files: {
					'public/dist/application.min.js': 'public/dist/application.js'
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'public/dist/application.min.css': '<%= applicationCSSFiles %>'
				}
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: watchFiles.serverViews.concat(watchFiles.serverJS)
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
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
		ngAnnotate: {
			production: {
				files: {
					'public/dist/application.js': '<%= applicationJavaScriptFiles %>'
				}
			}
		},
		concurrent: {
			default: ['nodemon', 'watch'],
			debug: ['nodemon', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			},
			secure: {
				NODE_ENV: 'secure'
			}
		},
		mochaTest: {
			src: watchFiles.mochaTests,
			options: {
				reporter: 'spec',
				require: 'server.js'
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		},
		/**
		 * Sass
		 */
		sass: {
		  dev: {
		  	options: {
		  		loadPath: [
		  			'public/lib/bootstrap-sass-official/assets/stylesheets',
		  			'public/lib/Bootflat/bootflat/scss'
		  		],
		  		update: true
		  	},		    
		    files: {
		      'public/styles/style.css': 'app/styles/main.scss',
		      'public/styles/bootstrap.css': 'app/styles/bootstrap-config.scss',
		      'public/styles/bootflat.css': 'app/styles/bootflat-config.scss'
		      //next line is not necessary if you include your bootstrap into the *.scss files
		      //'public/styles/bootstrap.css': 'public/lib/bootstrap-sass-official/assets/stylesheets/_bootstrap.scss'		      		     
		    }
		  },
		  dist: {
		  	//you could use this as part of the build job (instead of using cssmin)
		    options: {
		    	loadPath: ['public/lib/bootstrap-sass-official/assets/stylesheets','app/styles'],
		      style: 'compressed',
		      compass: false
		    },
		    files: {
		    	'public/dist/bootstrap.min.css': 'app/styles/bootstrap-config.scss',
		      'public/dist/style.min.css': 'app/styles/main.scss'
		    }
		  }
		}
	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// A Task for loading the configuration object
	grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
		var init = require('./config/init')();
		var config = require('./config/config');

		grunt.config.set('applicationJavaScriptFiles', config.assets.js);
		grunt.config.set('applicationCSSFiles', config.assets.css);
	});

	// Default task(s).
	grunt.registerTask('default', ['lint', 'sass:dev', 'concurrent:default']);

	// Debug task.
	grunt.registerTask('debug', ['lint', 'concurrent:debug']);

	// Secure task(s).
	grunt.registerTask('secure', ['env:secure', 'lint', 'concurrent:default']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);

	// Build task(s).
	grunt.registerTask('build', ['lint', 'loadConfig', 'ngAnnotate', 'uglify', 'sass:dist']);

	// Test task.
	grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
};