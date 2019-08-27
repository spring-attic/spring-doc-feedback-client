const { src, dest, series, parallel, watch } = require('gulp'),
    gulpSass = require('gulp-sass'),
    concat = require('gulp-concat'),
    gulpConnect = require('gulp-connect');

const paths = {
    dist: 'dist/',
};

// Compile SASS files to /dist/css/
const sass = () => {
    return src('src/sass/styles.scss')
        .pipe(gulpSass({ outputStyle: 'compressed' }))
        .pipe(dest(paths.dist + "css"));
}

// Compile HTML files to /dist/html/
const html = () => {
    return src('src/index.html')
        .pipe(dest(paths.dist + "html"));
}

// Compile JS files to /dist/js/
const js = () => {
    return src(['src/js/micromodal/micromodal.js', 'src/js/ua-parser/ua-parser.js', 'src/js/script.js'])
        .pipe(concat('feedback_script.js'))
        .pipe(dest(paths.dist + "js"));
}

// Watch files modified in js/sass folder and rebuild the resources
const watchFiles = (cb) => {
    watch('src/**', update);
    cb();
}

// Serve sample document and reload for changes
const connect = (cb) => {
    gulpConnect.server({
        root: paths.web,
        livereload: true
    });
    cb();
}

const build = series(sass, js, html);
const update = series(build);
exports.default = build;
exports.dev = series(update, parallel(connect, watchFiles));