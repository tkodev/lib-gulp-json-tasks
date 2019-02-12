// ****************************************************************************************************
// Init dependencies
// ****************************************************************************************************

// use strict code
'use strict';

// native dependencies
const path = require('path');

// dependencies
const bs = require('browser-sync');
const concat = require('gulp-concat');
const del = require('del');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const InstanceCtrl = require('instance-control');
const noop = require('gulp-noop');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const webpack = require('webpack');

// create new controller
let instanceCtrl = new InstanceCtrl();


// ****************************************************************************************************
// Shared Functions
// ****************************************************************************************************

// set default values
function setTaskDefaults(task){
  task = task || {};
  task.type = task.type || '';
  task.options = task.options || {};
  task.options.src = task.options.src || '';
  task.options.dest = task.options.dest || '';
  task.options.concat = task.options.concat || '';
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
  task.options.app.cmd = task.options.app.cmd || '';
  task.options.app.stdout = task.options.app.stdout || function(){} ;
  task.options.app.stderr = task.options.app.stderr || function(){} ;
  task.options.webpack = task.options.webpack || {};
  return task;
};

// define task actions
let gulpTasks = {
  'delete': function(done, task){
    return del(task.options.src);
  },
  'sass': function(done, task){
    return gulp.src(task.options.src)
      .pipe(plumber(function(msg) {
        console.log(`[${task.type} - error]`, msg);
      }))
      .pipe(task.options.sourcemaps ? sourcemaps.init() : noop())
      .pipe(sass(task.options.sass))
      .pipe(task.options.postcss.enable ? postcss(task.options.postcss.plugins) : noop())
      .pipe(task.options.concat ? concat(task.options.concat) : noop())
      .pipe(task.options.sourcemaps ? sourcemaps.write('map') : noop())
      .pipe(gulp.dest(task.options.dest))
      .pipe(bs.stream({
        once: true
      }))
      .pipe(plumber.stop());
  },
  'js': function(done, task){
    return gulp.src(task.options.src)
      .pipe(plumber(function(msg) {
        console.log(`[${task.type} - error]`, msg);
      }))
      .pipe(task.options.sourcemaps ? sourcemaps.init() : noop())
      .pipe(uglify(task.options.uglify))
      .pipe(task.options.concat ? concat(task.options.concat) : noop())
      .pipe(task.options.sourcemaps ? sourcemaps.write('map') : noop())
      .pipe(gulp.dest(task.options.dest))
      .pipe(plumber.stop());
  },
  'img': function(done, task){
    return gulp.src(task.options.src)
      .pipe(plumber(function(msg) {
        console.log(`[${task.type} - error]`, msg);
      }))
      .pipe(task.options.imagemin.enable ? imagemin(task.options.imagemin.plugins) : noop())
      .pipe(gulp.dest(task.options.dest))
      .pipe(plumber.stop());
  },
  'copy': function(done, task){
    return gulp.src(task.options.src)
      .pipe(plumber(function(msg) {
        console.log(`[${task.type} - error]`, msg);
      }))
      .pipe(task.options.concat ? concat(task.options.concat) : noop())
      .pipe(gulp.dest(task.options.dest))
      .pipe(plumber.stop());
  },
  'webpack': function(done, task){
    webpack(task.options.webpack, function (err, stats){
      if (err || stats.hasErrors()) {
        let statsStr = stats.toString({
          colors: true
        })
        console.error(`[${task.type} - error]`, statsStr);
      };
      done();
    });
  },
  'bs': function(done, task){
    return bs(task.options.bs, done);
  },
  'bs-reload': function(done, task){
    bs.reload();
    done();
  },
  'app': function(done, task){
    instanceCtrl.singleInstance('bashApp', task.options.app.cmd).then(function(subProcess){
      subProcess.stdout.on('data', function(data){
        task.options.app.stdout(done, data);
      });
      subProcess.stderr.on('data', function(data){
        task.options.app.stderr(done, data);
      });
      subProcess.on('exit', function(code, signal){
        done();
      });
    });
  }
};


// ****************************************************************************************************
// Module Exports
// ****************************************************************************************************

// taskCreator function
module.exports = function(done, task) {

  // by now, we should have `gulp`, `done` and `task` variables in our scope.
  // everything we need to build gulp task actions!
  
  // define task defaults
  task = setTaskDefaults(task);

  // return task actions
  if(gulpTasks.hasOwnProperty(task.type)){
    return gulpTasks[task.type](done, task);
  } else {
    console.log(`[gulp-task-wrappper - error] unsupported task type: '${task.type}'`);
    return;
  };

};


