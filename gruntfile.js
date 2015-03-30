/*!
 * Bootstrap-sync's Gruntfile
 * https://github.com/StevenBlack/bootstrap-sync
 * Copyright 2014-2015 Twitter, Inc.
 * Licensed under MIT (https://raw.githubusercontent.com/StevenBlack/bootstrap-sync/master/LICENSE-MIT)
 */
module.exports = function( grunt ) {
	'use strict';

	var optionsfile = 'gruntoptions.json';
	var _           = require('lodash');
	var pkg         = grunt.file.readJSON( 'package.json' );
	var options     = grunt.file.exists( optionsfile ) ? grunt.file.readJSON( optionsfile ) : {} ;
	var settings    = _.merge( {}, pkg.defaults, options );

	// Project configuration.
	grunt.initConfig({

		// Metadata.
		pkg: pkg,
		options: options,
		settings: settings,

		jqueryCheck: 'if (typeof jQuery === \'undefined\') { throw new Error(\'Bootstrap\\\'s JavaScript requires jQuery\') }\n\n' ,

		clean: {
			'bootstrap-source': [ '<%= settings.location.bootstrap.local %>/' ],
			'fonts': [ '<%= settings.location.deploy.fonts %>/' ],
			'css': [ '<%= settings.location.deploy.css %>/', "!<%= settings.location.deploy.css %>/main.css" ],
			'js': [ '<%= settings.location.deploy.js %>/' ]
		},

		copy: {
			'bootstrap-source': {
				nonull: true,
				expand: true,
				cwd: '<%= settings.location.bootstrap.authoritative %>/',
				src: [ 'fonts/*', 'js/*', 'less/**' ],
				dest: '<%= settings.location.bootstrap.local %>/'
			},
			'fontawesome-source': {
				nonull: true,
				expand: true,
				cwd: '<%= settings.location.fontawesome.authoritative %>/',
				src: [ 'fonts/*', 'css/*', 'less/*' ],
				dest: '<%= settings.location.fontawesome.local %>/'
			},
			'bootstrap-tweaks': {
				expand: true,
				flatten: true,
				src: [ '<%= settings.location.bootstrap.lesstweaks %>/*.less' ],
				dest: '<%= settings.location.bootstrap.local %>/less/'
			},
			'bootstrap-fonts': {
				expand: true,
				flatten: true,
				src: [ '<%= settings.location.bootstrap.local %>/fonts/*' ],
				dest: '<%= settings.location.deploy.fonts %>/'
			},
			'modern-business': {
				expand: true,
				flatten: true,
				src: [ 'modern-business/*' ],
				dest: '<%= settings.location.deploy.css %>/'
			},
			'fontawesome': {
				expand: true,
				flatten: true,
				src: [ '<%= settings.location.fontawesome.local %>/fonts/*' ],
				dest: '<%= settings.location.deploy.fonts %>/'
			}
		},

		concat: {
			options: {
				// Using the banner to inject a jQuery check.
				banner: '<%= jqueryCheck %>',
				stripBanners: false
			},
			bootstrapjs: {
				src: ( function() {
						var cwd = settings.location.bootstrap.local + '/';
						var arr = settings.task.concat.bootstrapjs.src;
						return arr.map(function(file) { return cwd + "/" + file; });
						}()
				),
				dest: '<%= settings.location.deploy.js %>/<%= settings.filename.js %>'
			}
		},

		uglify: {
			options: { report: 'min', compress: true },
			bootstrap: { src: [ '<%= concat.bootstrapjs.dest %>' ], dest: '<%= settings.location.deploy.js %>/<%= settings.filename.jsmin %>' }
		},

		less: {
			compileCore: {
				options: {
					strictMath: true,
					outputSourceFiles: true
				},
				files: { '<%= settings.location.deploy.css %>/<%= settings.filename.css %>': '<%= settings.location.bootstrap.local %>/less/<%= settings.filename.less %>' }
			}
		},

		cssmin: {
			combine: {
				files: {
					'<%= settings.location.deploy.css %>/<%= settings.filename.cssmin %>': [ '<%= settings.location.deploy.css %>/<%= settings.filename.css %>', '_font-awesome/css/font-awesome.css' ]
				}
			}
		}

	});

	// This one-liner replaces multiple grunt.loadNpmTasks() calls
	// See http://www.thomasboyt.com/2013/09/01/maintainable-grunt.html
	require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

	// Bootstrap tasks
	//    cleanup
	grunt.registerTask( 'clean-bootstrap', [ 'clean:bootstrap-source' ] );
	grunt.registerTask( 'clean-fonts', [ 'clean:fonts' ] );

	//    constructing
	grunt.registerTask( 'fetch-fresh-bootstrap', [ 'copy:bootstrap-source' ] );
	grunt.registerTask( 'fetch-fresh-fontawesome', [ 'copy:fontawesome-source' ] );
	grunt.registerTask( 'apply-bootstrap-tweaks', [ 'copy:bootstrap-tweaks' ] );
	grunt.registerTask( 'update-fonts', [ 'clean-fonts', 'copy:bootstrap-fonts', 'fetch-fresh-fontawesome', 'copy:fontawesome' ] );
	grunt.registerTask( 'bootstrap', [ 'clean-bootstrap', 'fetch-fresh-bootstrap', 'apply-bootstrap-tweaks', 'update-fonts' ] );

	// Less and css tasks
	grunt.registerTask( 'clean-css', [ 'clean:css' ] );
	grunt.registerTask( 'less-compile', [ 'less:compileCore' ]);
	grunt.registerTask( 'css-minify', [ 'cssmin' ]);
	grunt.registerTask( 'css', [ 'clean-css', 'copy:modern-business', 'less-compile', 'css-minify']);

	// js tasks
	grunt.registerTask( 'clean-js', [ 'clean:js' ] );
	grunt.registerTask( 'js-bootstrap', ['clean-js', 'concat:bootstrapjs']);
	grunt.registerTask( 'js-minify', [ 'uglify:bootstrap']);
	grunt.registerTask( 'js', [ 'js-bootstrap', 'js-minify' ]);

	// all
	grunt.registerTask(  'clean-all', ['clean-bootstrap', 'clean-fonts', 'clean-css', 'clean-js' ]);
	grunt.registerTask(  'default', ['bootstrap', 'css', 'js' ]);

};

