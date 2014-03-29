// Node modules
var fs = require('fs'), vm = require('vm'), merge = require('deeply'), chalk = require('chalk'),
    streamqueue = require('streamqueue'), es = require('event-stream');

// Gulp and plugins
var gulp = require('gulp'), rjs = require('gulp-requirejs'), concat = require('gulp-concat'), clean = require('gulp-clean'),
    replace = require('gulp-replace'), uglify = require('gulp-uglify'), insert = require('gulp-insert'), htmlreplace = require('gulp-html-replace');

// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('public_dev/js/require.config.js') + '; require;');
    requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
        out: 'scripts.js',
        baseUrl: './public_dev',
        name: 'js/startup',
        paths: {
            requireLib: 'bower_components/requirejs/require'
        },
        include: [
            'requireLib',
            'components/controls/navBar/navBar',
            'components/pages/home/home',
            'text!components/pages/about/about.html'
        ]
    });

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js', function () {
    return rjs(requireJsOptimizerConfig)
        .pipe(insert.append('\nrequire(["js/startup"]);')) // Runs app when the script file loads
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest('./public_prod/'));
});

// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
gulp.task('css', function () {
    var bowerCss = gulp.src('public_dev/bower_components/components-bootstrap/css/bootstrap.min.css')
            .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),
        appCss = gulp.src('public_dev/css/*.css'),
        emitCss = streamqueue({ objectMode: true }, bowerCss, appCss)
            .pipe(concat('css.css'))
            .pipe(gulp.dest('./public_prod/')),
        emitFonts = gulp.src('./public_dev/bower_components/components-bootstrap/fonts/*', { base: './public_dev/bower_components/components-bootstrap/' })
            .pipe(gulp.dest('./public_prod/'));
    return es.concat(emitCss, emitFonts);
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function() {
    return gulp.src('./public_dev/index.html')
        .pipe(htmlreplace({
            'css': 'css.css',
            'js': 'scripts.js'
        }))
        .pipe(gulp.dest('./public_prod/'));
});

// Removes all files from ./public_prod/
gulp.task('clean', function() {
    return gulp.src('./public_prod/**/*', { read: false })
        .pipe(clean());
});

gulp.task('default', ['html', 'js', 'css'], function(callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('public_prod/\n'));
});
