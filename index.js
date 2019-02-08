// ****************************************************************************************************
// Init dependencies
// ****************************************************************************************************

// use strict code
"use strict";

// native dependencies
const path = require('path');

// dependencies
const gulp = require("gulp");
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
const InstanceCtrl = require('instance-control')

// create new controller
let instanceCtrl = new InstanceCtrl();

// ****************************************************************************************************
// Shared Functions
// ****************************************************************************************************

// set default values
function setTaskDefaults(task){
	task = task || {};
	task.type = task.type || "";
	task.options = task.options || {};
	task.options.src = task.options.src || "";
	task.options.dest = task.options.dest || "";
	task.options.destDir = task.options.dest ? path.dirname(task.options.dest) : "";
	task.options.destName = task.options.dest ? path.basename(task.options.dest) : "";
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
	task.options.app = task.options.app || {};
	task.options.app.cmd = task.options.app.cmd || "";
	task.options.app.stdout = task.options.app.stdout || function(){} ;
	task.options.app.stderr = task.options.app.stderr || function(){} ;
	return task;
}


// ****************************************************************************************************
// Module Exports
// ****************************************************************************************************

// taskCreator function
module.exports = function(task) {

	// return gulp task function
	return function(done){

		// by now, we should have `gulp`, `task` and `done` in our scope.
		// everything we need to build gulp task actions!
		
		// define task defaults
		task = setTaskDefaults(task);

		// define task actions
		let gulpTasks = {
			"delete": function(){
				return del(task.options.src);
			},
			"sass": function(){
				return gulp.src(task.options.src)
					.pipe(plumber(function(msg) {
						console.log(`[${task.key}} - error]`, msg)
					}))
					.pipe(task.options.sourcemaps ? sourcemaps.init() : noop())
					.pipe(sass(task.options.sass))
					.pipe(task.options.postcss.enable ? postcss(task.options.postcss.plugins) : noop())
					.pipe(concat(task.options.destName))
					.pipe(task.options.sourcemaps ? sourcemaps.write('map') : noop())
					.pipe(gulp.dest(task.options.destDir))
					.pipe(bs.stream({
						once: true
					}))
					.pipe(plumber.stop());
			},
			"js": function(){
				return gulp.src(task.options.src)
					.pipe(plumber(function(msg) {
						console.log(`[${task.key}} - error]`, msg)
					}))
					.pipe(task.options.sourcemaps ? sourcemaps.init() : noop())
					.pipe(uglify(task.options.uglify))
					.pipe(concat(task.options.destName))
					.pipe(task.options.sourcemaps ? sourcemaps.write('map') : noop())
					.pipe(gulp.dest(task.options.destDir))
					.pipe(plumber.stop());
			},
			"img": function(){
				return gulp.src(task.options.src)
					.pipe(plumber(function(msg) {
						console.log(`[${task.key}} - error]`, msg)
					}))
					.pipe(task.options.imagemin.enable ? imagemin(task.options.imagemin.plugins) : noop())
					.pipe(gulp.dest(task.options.destDir))
					.pipe(plumber.stop());
			},
			"copy": function(){
				return gulp.src(task.options.src)
					.pipe(plumber(function(msg) {
						console.log(`[${task.key}} - error]`, msg)
					}))
					.pipe(gulp.dest(task.options.destDir))
					.pipe(plumber.stop());
			},
			"bs": function(){
				return bs(task.options.bs, done);
			},
			"bs-reload": function(){
				bs.reload();
				done();
			},
			"app": function(){
				function createProcess(options){
					let subProcess = instanceCtrl.startInstance('bashApp', options.cmd)
					subProcess.stdout.on('data', function(data){
						options.stdout(done, data);
					});
					subProcess.stderr.on('data', function(data){
						options.stderr(done, data);
					});
					subProcess.on('exit', function(code, signal){
						done();
					});
				}
				if(instanceCtrl.getInstances('bashApp').length){
					let subProcess = instanceCtrl.getInstances('bashApp')[0];
					subProcess.on('exit', function(code, signal){
						createProcess(task.options.app);
					});
					instanceCtrl.killInstances('bashApp');
				} else {
					createProcess(task.options.app);
				}
				
			}
		}

		// return task actions
		if(gulpTasks.hasOwnProperty(task.type)){
			return gulpTasks[task.type]();
		} else {
			console.log(`[gulp-task-wrappper - error] unsupported task type: '${task.type}'`)
			return;
		}

	}

};


