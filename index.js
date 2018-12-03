// ****************************************************************************************************
// Init dependencies
// ****************************************************************************************************

// use strict code
"use strict";

// native dependencies
const path = require('path');

// dependencies
const _ = require('lodash');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const del = require('del');
const filter = require('gulp-filter');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const noop = require("gulp-noop");

// init variables
const whitelist = ["delete", "sass", "js", "img", "copy", "bs", "bs-reload"]


// ****************************************************************************************************
// Module Exports
// ****************************************************************************************************

// Node, CommonJS-like
module.exports = function(gulp, tasks) {

	// create gulp tasks
	_.forEach(tasks, function(task, taskKey){

		// set default values
		task = task || {};
		task.key = taskKey || "";
		task.type = task.type || "";
		task.src = task.src || "";
		task.dest = task.dest || "";
		task.compression = task.compression || false;
		task.destDir = task.dest ? path.dirname(task.dest) : "";
		task.destName = task.dest ? path.basename(task.dest) : "";
		task.proxy = task.src.toLowerCase().indexOf("http") == 0 ? task.src : false;
		task.server = !task.proxy ? task.src : true;
		task.port = task.port || 3001;

		// init task
		if(whitelist.indexOf(task.type) > -1){
			gulp.task(task.key, function(done) {

				if(task.type == "delete"){
					return del(task.src);

				} else if (task.type == "sass"){
					return gulp.src(task.src)
						.pipe(plumber(function(msg) {
							console.log(`[${task.key}} - error]`, msg)
						}))
						.pipe(filter([ '**/*.scss', '**/*.css' ]))
						.pipe(sourcemaps.init())
						.pipe(sass({
							outputStyle: task.compression ? 'compressed' : 'nested'
						})) // compression
						.pipe(postcss([autoprefixer()]))
						.pipe(concat(task.destName))
						.pipe(sourcemaps.write('map'))
						.pipe(gulp.dest(task.destDir))
						.pipe(browserSync.stream({
							once: true
						}))
						.pipe(plumber.stop());

				} else if (task.type == "js"){
					return gulp.src(task.src)
						.pipe(plumber(function(msg) {
							console.log(`[${task.key}} - error]`, msg)
						}))
						.pipe(filter([ '**/*.js' ]))
						.pipe(sourcemaps.init())
						.pipe(task.compression ? uglify() : noop())
						.pipe(concat(task.destName))
						.pipe(sourcemaps.write('map'))
						.pipe(gulp.dest(task.destDir))
						.pipe(plumber.stop());

				} else if (task.type == "img"){
					return gulp.src(task.src)
						.pipe(plumber(function(msg) {
							console.log(`[${task.key}} - error]`, msg)
						}))
						.pipe(filter([ '**/*.{png|svg|jpg|jpeg|gif}' ]))
						.pipe(task.compression ? imagemin() : noop())
						.pipe(gulp.dest(task.destDir))
						.pipe(plumber.stop());

				} else if (task.type == "copy"){
					return gulp.src(task.src)
						.pipe(plumber(function(msg) {
							console.log(`[${task.key}} - error]`, msg)
						}))
						.pipe(gulp.dest(task.destDir))
						.pipe(plumber.stop());

				} else if (task.type == "bs"){
					return browserSync({
						proxy: task.proxy,
						server: task.server,
						port: task.port,
						open: true,
						notify: false
					}, done());
					
				} else if (task.type == "bs-reload"){
					return browserSync.reload
				}
			});

		} else {
			console.log(`[gulp-task-wrappper - error] unsupported task type: '${task.type}'`)
		}

	})

	// return
	return this;

};


