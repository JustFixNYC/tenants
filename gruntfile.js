'use strict';

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverViews: ['app/views/**/*.*'],
		serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
		serverJSON: ['app/data/*.json'],
		serverSASS: ['app/styles/{,*/}*.{scss,sass}'],
		//serverSASS: ['app/styles/{,*/}*.{scss,sass}', '!app/styles/bootstrap-config.scss'],
		clientViews: ['public/modules/**/views/**/*.html'],
		clientJS: ['public/*.js', 'public/modules/**/*.js'],
		clientCSS: ['public/styles/main.css', '!public/styles/vendor.css'],
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
			serverJSON: {
				files: watchFiles.serverJSON,
				tasks: ['jshint'],
				options: {
					livereload: true,
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
	  concat: {
	    dist: {
	      src: '<%= applicationJavaScriptLibraryFiles %>',
	      dest: 'public/dist/vendor.js',
	    },
	  },
		uglify: {
			production: {
				options: {
					mangle: false,
					sourceMap: true
				},
				files: {
					'public/dist/vendor.min.js': 'public/dist/vendor.js',
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
		// Automatically inject Bower components into files
		wiredep: {
			sass: {
				src: ['app/styles/{,*/}*.{scss,sass}'],
				ignorePath: /^(\.\.\/)+/,
				options: {
					fileTypes: {
							scss: {
									replace: {
											scss: '@import "../../{{filePath}}";'
									}
							}
					}
				}
			}
		},
		/**
		 * Sass
		 */
		sass: {
		  dev: {
		  	options: {
		  		loadPath: [
						'app/styles',
		  			'public/lib/bootstrap-sass-official/assets/stylesheets',
		  			'public/lib/Bootflat/bootflat/scss'
		  		],
		  		sourceMap: false
		  	},
		    files: {
		      'public/styles/vendor.css': 'app/styles/vendor.scss',
		      'public/styles/style.css': 'app/styles/main.scss'
		    }
		  },
		  dist: {
		  	//you could use this as part of the build job (instead of using cssmin)
		    options: {
					loadPath: [
						'app/styles',
		  			'public/lib/bootstrap-sass-official/assets/stylesheets',
		  			'public/lib/Bootflat/bootflat/scss'
		  		],
		      style: 'compressed',
		      compass: false
		    },
		    files: {
		      'public/dist/vendor.min.css': 'app/styles/vendor.scss',
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
		grunt.config.set('applicationJavaScriptLibraryFiles', config.assets.lib.js);
		grunt.config.set('applicationCSSFiles', config.assets.css);
	});

	// Default task(s).
	grunt.registerTask('default', ['lint', 'wiredep', 'sass:dev', 'concurrent:default']);
	grunt.registerTask('serve', ['default']);

	// Debug task.
	grunt.registerTask('debug', ['lint', 'concurrent:debug']);

	// Secure task(s).
	grunt.registerTask('secure', ['env:secure', 'lint', 'concurrent:default']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);

	// Build task(s).
	grunt.registerTask('build', ['lint', 'loadConfig', 'ngAnnotate', 'concat:dist', 'uglify', 'sass:dist']);

	// Test task.
	grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
};
