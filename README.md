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
"use strict";

// dependencies
const gulp = require("gulp");
const jsonTask = require('gulp-json-tasks');
const autoprefixer = require('autoprefixer');


// ****************************************************************************************************
// Create Tasks
// ****************************************************************************************************

gulp.task("delete", jsonTask({
  type: "delete",
  options: {
    src: "./public"
  }
}));

gulp.task("css", jsonTask({
  type: "sass",
  options: {
    src: `private/css/app.scss`,
    dest: `public/css/app.css`,
    sourcemaps: true,
    sass: { 
      outputStyle: 'compressed' 
    },
    postcss: { 
      enable: true, 
      plugins: [autoprefixer()] 
    }
  }
}));

gulp.task("js", jsonTask({
  type: "js",
  options: {
    src: `private/js/*.js`,
    dest: `public/js/app.js`,
    sourcemaps: false,
    uglify: { 
      compress: true 
    }
  }
}));

gulp.task("img", jsonTask({
  type: "img",
  options: {
    src: `private/img/**/*`,
    dest: `public/img/*`,
    imagemin: { 
      enable: false 
    }
  }
}));

gulp.task("assets", jsonTask({
  type: "copy",
  options: {
    src: `private/assets/**/*`,
    dest: `public/assets/*`
  }
}));

gulp.task("root", jsonTask({
  type: "copy",
  options: {
    src: `private/*.*`,
    dest: `public/*`
  }
}));

gulp.task("bs", jsonTask({
  type: "bs",
  options: {
    bs: {
      server: './public', 
      port: 3001, 
      open: true 
    }
  }
}))

gulp.task("bs-reload", jsonTask({
  type: "bs-reload"
}))

gulp.task("app", jsonTask({
  type: "app",
  options: {
    app: {
      cmd: 'node example-process.js',
      stdout: function(done, data){
        if(data.toString().indexOf('ready') > -1){
          done();
        }
      }
    }
  }
}))

gulp.task("app-reload", gulp.series('app'));


// ****************************************************************************************************
// Tasks - collection
// ****************************************************************************************************

// watchers
gulp.task("watcher", function(done) {
  gulp.watch(`private/css/**/*`        ).on("all", gulp.series("css"));
  gulp.watch(`private/js/**/*`        ).on("all", gulp.series("js", "bs-reload"));
  gulp.watch(`private/img/**/*`        ).on("all", gulp.series("img", "bs-reload"));
  gulp.watch(`private/assets/**/*`    ).on("all", gulp.series("assets", "bs-reload"));
  gulp.watch(`private/*.*`            ).on("all", gulp.series("root", "app-reload", "bs-reload"));
  done();
});

// commands
gulp.task("build", gulp.series("delete", gulp.parallel("css", "js", "img", "assets", "root")));
gulp.task("watch", gulp.series("build", "bs", "app", "watcher"));
```