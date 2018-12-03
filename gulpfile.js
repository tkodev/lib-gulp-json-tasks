// ****************************************************************************************************
// Init
// ****************************************************************************************************

// use strict code
"use strict";

// dependencies
const gulp = require("gulp");


// ****************************************************************************************************
// Tasks - Create using wrapper
// ****************************************************************************************************

var tasks = require('./index.js')(gulp, {
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
	"misc": {
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

// ****************************************************************************************************
// Tasks - collection
// ****************************************************************************************************

// watchers
gulp.task("watcher", function(done) {
	gulp.watch(`private/css/**/*`				).on("all", gulp.series("css"));
	gulp.watch(`private/js/**/*`				).on("all", gulp.series("js", "bs-reload"));
	gulp.watch(`private/img/**/*`				).on("all", gulp.series("img", "bs-reload"));
	gulp.watch(`private/assets/**/*`		).on("all", gulp.series("assets", "bs-reload"));
	gulp.watch(`private/*.*`						).on("all", gulp.series("misc", "bs-reload"));
	done();
});

// commands
gulp.task("build", gulp.series("clean", gulp.parallel("css", "js", "img", "assets", "misc")));
gulp.task("watch", gulp.series("build", "bs", "watcher"));

