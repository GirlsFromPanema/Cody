const { series, parallel } = require("gulp");

function clean(cb) {
    // body omitted
    cb();
}

function cssTranspile(cb) {
    // body omitted
    cb();
}

function cssMinify(cb) {
    // body omitted
    cb();
}

function jsTranspile(cb) {
    // body omitted
    cb();
}

function jsBundle(cb) {
    // body omitted
    cb();
}

function jsMinify(cb) {
    // body omitted
    cb();
}

function publish(cb) {
    // body omitted
    cb();
}

exports.build = series(
    clean,
    parallel(cssTranspile, series(jsTranspile, jsBundle)),
    parallel(cssMinify, jsMinify),
    publish
);