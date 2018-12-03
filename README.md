# Facetor
- 🔍 Gulp Task Wrapper - A NPM module to help build Gulp (v4.x.x) tasks using simple JSON object.
- 

## USAGE
- Gulp Task Wrapper simplifies Gulpfile task creation via preset tasks included in our module. 
	- We first supply the module with a JSON object specifying the tasks and configuration
	- The module then takes this JSON object and depending on contents, enables certain preset tasks for Gulp.
		- `delete` type tasks: deletes folder using `del`
		- `sass` type tasks: process files using `gulp-sass`, `post-css`, `autoprefixer`, `gulp-sourcemaps`
		- `js` type tasks: process files using `gulp-concat`, `gulp-uglify`, `gulp-sourcemaps`
		- `img` type tasks: process files using `gulp-imagemin`
		- `copy` type tasks: process files using gulp's `gulp.src`, `gulp.dest`
		- `bs` and `bs-reload` type tasks: creates a BrowserSync instance task and reload task, respectively.

### Prep - Load the module
Let's load the module
- On Node.js / CommonJS:
  - in terminal: `npm install gulp-task-wrapper`
  - in node: `var taskWrapper = require('gulp-task-wrapper')`

### Step 1
We first supply the module with a JSON object specifying the tasks and configuration
- EX: Here we're creating a css, js, img compressor and misc file copy workflow, 
	- Files sourced from a folder called `./private` with subdirectories `css`, `js`, `img`, `assets`
	- Files sent to a folder called `./public`
```js
const gulp = require("gulp");
const tasksWrapper = require('gulp-tasks-wrapper')

var tasks = tasksWrapper(gulp, {
	"clean": {
		type: "delete",
		src: "./public"
	},
	"css": {
		type: "sass",
		src: `private/css/app.scss`,
		dest: `public/css/app.css`,
		compression: false
	},
	"js": {
		type: "js",
		src: `private/js/*.js`,
		dest: `public/js/app.js`,
		compression: false
	},
	"img": {
		type: "img",
		src: `private/img/**/*`,
		dest: `public/img/*`,
		compression: false
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
		src: "./public",
		port: 3001
	},
	"bs-reload": {
		type: "bs-reload"
	}
})
```

### Step 2
The module then takes this JSON object and depending on contents, enables certain preset tasks for Gulp.
- EX: Since we've supplied our config, our gulp tasks are now ready to be referenced in any subsequent gulp functions!
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

## To do for version 2
- Allow options to be passed to `gulp-sass`, `post-css`, `autoprefixer`, `gulp-uglify` `imagemin`, `browserSync`, etc
- Create "process" task, to run CLI command tasks via node's child process functions.
	- This can allow gulp to run express servers, etc with BrowserSync
