// ****************************************************************************************************
// Init
// ****************************************************************************************************

// use strict code
"use strict";

// dependencies
const gulp = require("gulp");
const tasksWrapper = require('./index.js')
const autoprefixer = require('autoprefixer');


// ****************************************************************************************************
// Create tasks using wrapper
// ****************************************************************************************************

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
			postcss: { enable: true, plugins: [autoprefixer()] }
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
			imagemin: { enable: false }
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


// ****************************************************************************************************
// Tasks - collection
// ****************************************************************************************************

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

