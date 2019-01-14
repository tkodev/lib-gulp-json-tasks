// ****************************************************************************************************
// Init dependencies
// ****************************************************************************************************

// use strict code
"use strict";

// native dependencies
const path = require('path');

// dependencies
const _ = require('lodash');
const del = require('del');
const noop = require("gulp-noop");
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const bs = require('browser-sync');

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
		task.destDir = task.dest ? path.dirname(task.dest) : "";
		task.destName = task.dest ? path.basename(task.dest) : "";
		task.options = task.options || {};
		task.options.sourcemaps = task.options.sourcemaps || false;
		task.options.sass = task.options.sass || {};
		task.options.postcss = task.options.postcss || {};
		task.options.postcss.enable = task.options.postcss.enable || false;
		task.options.postcss.plugins = task.options.postcss.plugins || null;
		task.options.uglify = task.options.uglify || {};
		task.options.imagemin = task.options.imagemin || {};
		task.options.imagemin.enable = task.options.imagemin.enable || false;
		task.options.imagemin.plugins = task.options.imagemin.plugins || null;
		task.options.bs = task.options.bs || {};

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
						.pipe(task.options.sourcemaps ? sourcemaps.init() : noop())
						.pipe(sass(task.options.sass))
						.pipe(task.options.postcss.enable ? postcss(task.options.postcss.plugins) : noop())
						.pipe(concat(task.destName))
						.pipe(task.options.sourcemaps ? sourcemaps.write('map') : noop())
						.pipe(gulp.dest(task.destDir))
						.pipe(bs.stream({
							once: true
						}))
						.pipe(plumber.stop());
				} else if (task.type == "js"){
					return gulp.src(task.src)
						.pipe(plumber(function(msg) {
							console.log(`[${task.key}} - error]`, msg)
						}))
						.pipe(task.options.sourcemaps ? sourcemaps.init() : noop())
						.pipe(uglify(task.options.uglify))
						.pipe(concat(task.destName))
						.pipe(task.options.sourcemaps ? sourcemaps.write('map') : noop())
						.pipe(gulp.dest(task.destDir))
						.pipe(plumber.stop());
				} else if (task.type == "img"){
					return gulp.src(task.src)
						.pipe(plumber(function(msg) {
							console.log(`[${task.key}} - error]`, msg)
						}))
						.pipe(task.options.imagemin.enable ? imagemin(task.options.imagemin.plugins) : noop())
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
					return bs(task.options.bs, done);
				} else if (task.type == "bs-reload"){
					return bs.reload
				}
			});

		} else {
			console.log(`[gulp-task-wrappper - error] unsupported task type: '${task.type}'`)
		}

	})

	// return
	return this;

};


