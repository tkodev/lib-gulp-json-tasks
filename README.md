# Gulp Task Wrapper
- 🔍 Gulp Task Wrapper - A NPM module to help build Gulp (v4.x.x) tasks using simple JSON config.
  - Gulp mixes configuration with logic - leading to mixing of concerns and bloated files. 
  - Why work with streams, or write new gulp task, when most web workflows just deal with the same thing over and over.

## Usage Summary
- Prep: Load the module
- Step 1: Tell the module what prebuilt tasks to make available.
	- `delete` type tasks: deletes folders using `del`
	- `sass` type tasks: process files using `gulp-sass`, `post-css`, `autoprefixer`, `gulp-sourcemaps`
	- `js` type tasks: process files using `gulp-concat`, `gulp-uglify`, `gulp-sourcemaps`
	- `img` type tasks: process files using `gulp-imagemin`
	- `copy` type tasks: process files using gulp's `gulp.src`, `gulp.dest`
	- `bs` and `bs-reload` type tasks: creates a BrowserSync instance task and reload task, respectively.
- Step 2: Use these tasks in regular gulp workflow.

### Prep
Let's load the module
- On Node.js / CommonJS:
  - in terminal: `npm install gulp-task-wrapper`
  - in node: `const taskWrapper = require('gulp-task-wrapper')`


### Step 1
We Tell the module what prebuilt tasks to make available.
- EX: Here we're creating a css, js, img compression, file copy and BrowserSync tasks.
	- Files sourced from a folder called `./private` with subdirectories `css`, `js`, `img`, `assets`
	- Files sent to a folder called `./public`
```js

// dependencies
const gulp = require("gulp");
const tasksWrapper = require('gulp-tasks-wrapper')
const autoprefixer = require('autoprefixer');

// create tasks using wrapper
tasksWrapper(gulp, {
	"clean": {
		type: "delete",
		src: "./public"
	},
	"css": {
		type: "sass",
		src: `private/css/app.scss`,
		dest: `public/css/app.css`,
		options: {
			sass: { outputStyle: 'compressed' },
			postcss: { enable: true, plugins: [autoprefixer()] } // pass autoprefixer plugin
		}
	},
	"js": {
		type: "js",
		src: `private/js/*.js`,
		dest: `public/js/app.js`,
		options: {
			uglify: { compress: true }
		}
	},
	"img": {
		type: "img",
		src: `private/img/**/*`,
		dest: `public/img/*`,
		options: {
			imagemin: { enable: true, plugins: null } // default plugins
		}
	},
	"assets": {
		type: "copy",
		src: `private/assets/**/*`,
		dest: `public/assets/*`,
	},
	"root": {
		type: "copy",
		src: `private/*.*`,
		dest: `public/*`,
	},
	"bs": {
		type: "bs",
		options: { 
			bs: { server: './public', port: 3001, open: true }
		}
	},
	"bs-reload": {
		type: "bs-reload"
	}
})
```


### Step 2
Use these tasks in regular gulp workflow.
- EX: Here we are using the tasks with gulp features such as `gulp.watch` and `gulp.parallel`.
  - You'll notice `css`, `js`, `img`, `assets`, `root` tasks configured earlier are referenced in the following.
```js
// watchers
gulp.task("watcher", function(done) {
	gulp.watch(`private/css/**/*`				).on("all", gulp.series("css"));
	gulp.watch(`private/js/**/*`				).on("all", gulp.series("js", "bs-reload"));
	gulp.watch(`private/img/**/*`				).on("all", gulp.series("img", "bs-reload"));
	gulp.watch(`private/assets/**/*`		).on("all", gulp.series("assets", "bs-reload"));
	gulp.watch(`private/*.*`						).on("all", gulp.series("root", "bs-reload"));
	done();
});

// commands
gulp.task("build", gulp.series("clean", gulp.parallel("css", "js", "img", "assets", "root")));
gulp.task("watch", gulp.series("build", "bs", "watcher"));
```