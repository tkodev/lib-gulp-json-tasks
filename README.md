# Gulp JSON Tasks
- 🔍 Gulp JSON Tasks - A NPM module to create Gulp 4.x tasks via JSON config.
  - Quickly use common gulp tasks! Leverage best of config based build tool alongside Gulp's programmatic style!
  - **Not for public production! Please fork for personal use!** - This module is for @htkoca's private development.

## Usage Summary
- Prep: Load the module
- Step 1: Create a task with `jsonTask` function, with support for the following task types.
  - `delete` type tasks: deletes folders using `del`
  - `sass` type tasks: process files using `gulp-sass`, `post-css`, `autoprefixer`, `gulp-sourcemaps`
  - `js` type tasks: process files using `gulp-concat`, `gulp-uglify`, `gulp-sourcemaps`
  - `img` type tasks: process files using `gulp-imagemin`
  - `copy` type tasks: process files using gulp's `gulp.src`, `gulp.dest`
  - `webpack` type tasks: process files using `webpack`
  - `bs` and `bs-reload` type tasks: creates a BrowserSync instance task and reload task, respectively.
  - `app` and `app-reload` type tasks: creates an application instance task and restart app task, respectively.
- Step 2: Use these tasks in regular gulp workflow.

### Example Usage
- Load the module in terminal: `npm install gulp-json-tasks`
- Example below: Task creation for sass, js, img compression, file copy and BrowserSync.
  - Files are sourced from a folder called `./private` with subdirectories `css`, `js`, `img`, `assets`
  - Files are sent to a folder called `./public`

```js
// ****************************************************************************************************
// Init
// ****************************************************************************************************

// use strict code
'use strict';

// dependencies
const gulp = require('gulp');
const jsonTask = require('./index.js');
const autoprefixer = require('autoprefixer');
const path = require('path');


// ****************************************************************************************************
// Create Tasks
// ****************************************************************************************************

gulp.task('delete', function(done){
  return jsonTask(done, {
    type: 'delete',
    options: {
      src: './public'
    }
  });
});

gulp.task('css', function(done){
  return jsonTask(done, {
    type: 'sass',
    options: {
      src: `private/css/app.scss`,
      dest: `public/css`,
      concat: `app.css`,
      sourcemaps: true,
      sass: { 
        outputStyle: 'compressed' 
      },
      postcss: { 
        enable: true, 
        plugins: [autoprefixer()] 
      }
    }
  });
});

gulp.task('js', function(done){
  return jsonTask(done, {
    type: 'js',
    options: {
      src: `private/js/*.js`,
      dest: `public/js`,
      concat: `app.js`,
      sourcemaps: false,
      uglify: { 
        compress: true 
      }
    }
  });
});

gulp.task('img', function(done){
  return jsonTask(done, {
    type: 'img',
    options: {
      src: `private/img/**/*`,
      dest: `public/img`,
      imagemin: { 
        enable: false 
      }
    }
  });
});

gulp.task('assets', function(done){
  return jsonTask(done, {
    type: 'copy',
    options: {
      src: `private/assets/**/*`,
      dest: `public/assets`,
      concat: false
    }
  });
});

gulp.task('root', function(done){
  return jsonTask(done, {
    type: 'copy',
    options: {
      src: `private/*.{html,txt}`,
      dest: `public`,
      concat: false
    }
  });
});

gulp.task('webpack', function(done){
  return jsonTask(done, {
    type: 'webpack',
    options: {
      webpack: {
        mode: 'production',
        entry: {
          app: path.resolve('./private/entry.js'),
        },
        output: {
          path: path.resolve('./public'),
          filename: 'bundle.js'
        }
      }
    }
  });
});

gulp.task('bs', function(done){
  return jsonTask(done, {
    type: 'bs',
    options: {
      bs: {
        server: './public', 
        port: 3001, 
        open: true 
      }
    }
  });
});

gulp.task('bs-reload', function(done){
  return jsonTask(done, {
    type: 'bs-reload'
  });
});

gulp.task('app', function(done){
  return jsonTask(done, {
    type: 'app',
    options: {
      app: {
        cmd: 'node example-process.js',
        stdout: function(done, data){
          if(data.toString().indexOf('ready') > -1){
            done();
          };
        }
      }
    }
  });
});

gulp.task('app-reload', gulp.series('app'));


// ****************************************************************************************************
// Tasks - collection
// ****************************************************************************************************

// watchers
gulp.task('watcher', function(done) {
  gulp.watch(`private/css/**/*`    ).on('all', gulp.series('css'));
  gulp.watch(`private/js/**/*`     ).on('all', gulp.series('js', 'bs-reload'));
  gulp.watch(`private/img/**/*`    ).on('all', gulp.series('img', 'bs-reload'));
  gulp.watch(`private/assets/**/*` ).on('all', gulp.series('assets', 'bs-reload'));
  gulp.watch(`private/*.js`        ).on('all', gulp.series('webpack', 'app-reload', 'bs-reload'));
  gulp.watch(`private/*.{html,txt}`).on('all', gulp.series('root', 'app-reload', 'bs-reload'));
  done();
});

// commands
gulp.task('build', gulp.series('delete', gulp.parallel('css', 'js', 'img', 'assets', 'root', 'webpack')));
gulp.task('watch', gulp.series('build', 'bs', 'app', 'watcher'));
```