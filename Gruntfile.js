'use strict';

module.exports = function (grunt) {
	var target = grunt.option('target') || 'develop';
	var config = {
			'rootdir': 'public'
		
	};


	grunt.initConfig({
		config: config,

		pkg: grunt.file.readJSON('package.json'),

		develop: {
			server: {
				file: 'app.js',
				//nodeArgs: ['--debug'],
				env: { NODE_ENV: 'develop' }
			}
		},

		compass: {                  // Task
			develop: {                   // Target
				options: {              // Target options
					httpPath:'/',
					sassDir: config.rootdir + '/css/scss',
					cssDir: config.rootdir + '/css',
					imagesDir: config.rootdir + '/images/sprites',
					httpGeneratedImagesPath:'/images/sprites'
				}
			},

			production: {                   // Target
				options: {              // Target options
					httpPath:'/',
					sassDir: config.rootdir + '/css/scss',
					cssDir: config.rootdir + '/css',
					imagesDir: config.rootdir + '/images/sprites',
					httpGeneratedImagesPath:'/images/sprites',
					outputStyle: 'compressed'
				}
			}
		},

		watch: {
			options: {
				nospawn: true
			},
			css: {
				files: ['<%= config.rootdir %>/css/scss/*.{sass,scss}', '<%= config.rootdir %>/css/scss/**/*.{sass,scss}' ],
				tasks: ['compass:'+ target]
			}

		},

		shell: {
			//mocha unit tests
			test: {
				options: {
					stdout: true
				},
				command: 'NODE_ENV=test ./node_modules/.bin/mocha --colors --reporter spec test/test-*.js'
			},
			//mocha unit tests and report on code coverage
			testcoverage: {
				command: 'NODE_ENV=test ./node_modules/istanbul/lib/cli.js cover ./node_modules/mocha/bin/_mocha -- test/test-*.js --reporter spec'
			},

			nodemon : {
				command: 'NODE_ENV=development ./node_modules/.bin/nodemon app.js'
			}
		},

		clean: {
			//Clean generated coverage dir
			testcoverage: ['coverage']
		}


	});

 /* "scripts": {
		"start": "NODE_ENV=development ./node_modules/.bin/nodemon app.js",
		"test": "NODE_ENV=test ./node_modules/.bin/mocha --reporter spec test/test-*.js"
	},*/

	grunt.loadNpmTasks('grunt-develop');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-shell');

	grunt.registerTask('default', [
		
		//'develop', 
		'compass:' + target,
		'watch'
	]);
	grunt.registerTask('nodemon', [
		'shell:nodemon', 
		'compass:' + target,
		'watch']);
	grunt.registerTask('test', ['shell:test']);
	grunt.registerTask('testcoverage', ['clean:testcoverage', 'shell:testcoverage']);

};
