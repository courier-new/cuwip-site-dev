import browserSync from 'browser-sync';
import browserify from 'browserify';
import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import imagemin from 'gulp-imagemin';
import jsonminify from 'gulp-jsonminify';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import watch from 'gulp-watch';
import wrap from 'gulp-wrap';
import notifier from 'node-notifier/notifiers/toaster'; // Windows 10 - Requires SnoreToast

// Track if doing full build (all tasks) or just individual task, track file that triggered task
let building = false,
    currFile = "";

// Sass and css filepaths
const scssPaths = {
	main: 'css/scss/main.scss',
	src: 'css/scss/*.scss',
	dest: 'css'
};

// JS filepaths
const jsPaths = {
	src: 'js/comp/*.js',
	srcFolder: 'js/comp/',
	srcOrdered: ['global.js', 'scroll-effect.js', 'nav.js', 'countdown.js', 'apply.js', 'timeline.js', 'device.js', 'test-date.js'],
	dest: 'js',
	distName: 'all-concat-dist.js'
};

// JSON filepaths
const jsonPaths = {
	src: ['js/comp/apply.json', 'js/comp/nav.json',],
	agendaSrc: 'agenda/agenda.json',
	dest: 'js/comp/'
};

// Image filepaths
const imgPaths = {
	src: 'img/orig/*.{png,gif,jpg}',
	dest: 'img'
};

gulp.task('browserSync', () =>
	browserSync.init({
		server: {
			baseDir: './',
			online: true
		},
	})
);

gulp.task('styles', () => {
	Promise.all([
		new Promise(function(resolve, reject) {
			gulp.src(scssPaths.main)
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'nested'}))
			.on('error', reject)
			.pipe(autoprefixer({
				browsers: ['last 5 versions'],
				cascade: false
			})).pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(scssPaths.dest))
			.on('end', resolve)
			.pipe(browserSync.reload({
				stream: true
			}));
		})
	]).then( success => {
		if (!building) {
			let titleText = 'Gulp ran [gulp-sass]';
			titleText += (currFile) ? ` on ${currFile}.` : '.';
			new notifier().notify({
				title: titleText,
				message: 'Gulp is waiting for next task.',
				icon: 'gulp.png'
			});
			currFile = '';
		}
	}).catch( error => reportError(error)
	);
});

let bindJSTask = (src, name, dest) => () => {
	Promise.all([
		new Promise(function(resolve, reject) {
			gulp.src(src)
			.pipe(sourcemaps.init())
        	.pipe(babel({
         	presets: ["es2015"]
        	})).on('error', reject)
      	.pipe(concat(name))
			.pipe(wrap('(function() {\n<%= contents %>\n})();'))
			.pipe(plumber())
			.pipe(sourcemaps.write('.'))
		   .pipe(gulp.dest(dest))
			.on('end', resolve)
			.pipe(browserSync.reload({
				stream: true
			}));
		})
	]).then( success => {
		if (!building) {
			let titleText = 'Gulp ran [babelify]';
			titleText += (currFile) ? ` on ${currFile}.` : '.';
			new notifier().notify({
				title: titleText,
				message: 'Gulp is waiting for next task.',
				icon: 'gulp.png'
			});
			currFile = '';
		}
	}).catch( error => reportError(error)
	);
};

gulp.task('scripts', bindJSTask(jsPaths.srcOrdered.map(f => jsPaths.srcFolder + f), jsPaths.distName, jsPaths.dest));

gulp.task('agendaScript', bindJSTask('agenda/agenda.js', 'agenda-dist.js', 'agenda'));

let bindJSONTask = (src) => () => {
	Promise.all([
		new Promise(function(resolve, reject) {
			gulp.src(src, {
				base: './'
			}).pipe(jsonminify())
			.on('error', reject)
			.pipe(rename({
         	suffix: '.min'
        	})).pipe(gulp.dest('.'))
			.on('end', resolve)
			.pipe(browserSync.reload({
				stream: true
			}));
		})
	]).then( success => {
		if (!building) {
			let titleText = 'Gulp ran [gulp-jsonminify]';
			titleText += (currFile) ? ` on ${currFile}.` : '.';
			new notifier().notify({
				title: titleText,
				message: 'Gulp is waiting for next task.',
				icon: 'gulp.png'
			});
			currFile = '';
		}
	}).catch( error => reportError(error)
	);
};

gulp.task('jsonGeneral', bindJSONTask(jsonPaths.src));
gulp.task('jsonAgenda', bindJSONTask(jsonPaths.agendaSrc));

gulp.task('images', () => {
	Promise.all([
		new Promise(function(resolve, reject) {
			gulp.src(imgPaths.src)
			.pipe(imagemin([
				imagemin.jpegtran({progressive: true}),
				imagemin.optipng({optimizationLevel: 5})
			])).on('error', reject)
			.pipe(gulp.dest(imgPaths.dest))
			.on('end', resolve)
		   .pipe(browserSync.reload({
				stream: true
			}));
		})
	]).then( success => {
		if (!building) {
			let titleText = 'Gulp ran [gulp-imagemin]';
			titleText += (currFile) ? ` on ${currFile}.` : '.';
			new notifier().notify({
				title: titleText,
				message: 'Gulp is waiting for next task.',
				icon: 'gulp.png'
			});
			currFile = '';
		}
	}).catch( error => reportError(error)
	);
});

gulp.task('build', () => {
	building = true;
	Promise.all([
		new Promise(function(resolve, reject) {
			gulp.start('styles');
			resolve();
		})
	], [
		new Promise(function(resolve, reject) {
			gulp.start('scripts');
			gulp.start('agendaScript');
			resolve();
		})
	], [
		new Promise(function(resolve, reject) {
			gulp.start('jsonGeneral');
			gulp.start('jsonAgenda');
			resolve();
		})
	]).then( success => {
		new notifier().notify({
			title: 'Full build complete.',
			message: 'Gulp finished running all tasks.',
			icon: 'gulp.png'
		});
	}).catch( error => reportError(error)
	);
});

gulp.task('watch', ['browserSync', 'build'], () => {
	let watchPairs = {
		'styles': scssPaths.src,
		'scripts': jsPaths.src,
		'agendaScript': 'agenda/agenda.js',
		'jsonGeneral': jsonPaths.src,
		'jsonAgenda': jsonPaths.agendaSrc,
		'images': imgPaths.src,
	};

	Object.entries(watchPairs).forEach(([t, s]) => wrapWatch({src: s, task: t}));
	watch('**/*.html', () => browserSync.reload());
});

let wrapWatch = ({src, task}) => {
	watch(src, (file) => {
		currFile = file.path.match(/\/[^\/]+\.[^\/]+/).pop().substring(1);
		building = false;
		gulp.start(task);
	});
};

let reportError = (error) => {
	let lineNumber = (error.lineNumber || error.line);
	let pluginName = (error.plugin) ? '['+error.plugin+']' : '';
	let filePath = (error.fileName || error.relativePath);
	let message = "";
	if (error.messageOriginal) {
		message = error.messageOriginal.replace(/"/g, "'");
		let messageArr = message.split(" ");
		let file = filePath.match(/\/[^\/]+\.[^\/]+/).pop().substring(1);
		let toastMessage = 'Error on line ' + lineNumber + ' of file ' + file + ':\n';
		while (messageArr.length && toastMessage.length + messageArr[0].length < 230) {
			if (messageArr[0].length === 0 || /^[\s\0\n\r\t|+]$/g.test(messageArr[0])) {
				messageArr.shift();
			} else {
				toastMessage += messageArr.shift() + ' ';
			}
		}
		toastMessage += '...';

		new notifier().notify({
			title: 'Gulp could not run ' + pluginName + '.',
			message: toastMessage,
			icon: 'gulp.png'
		});
	}

	let report = 'TASK  : ' + pluginName + '\n';
	report += (filePath) ? 'FILE  : ' + filePath + '\n' : '';
	report += 'ERROR : ';
	report += (message.length) ? message : error.message;
	report += '\n';
	report += (lineNumber) ? 'LINE  : ' + lineNumber : '';
	console.error(report);
};

gulp.task('default', ['watch']);
