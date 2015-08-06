'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var csc = require('css-selectors-count');
var PluginError = gutil.PluginError;

var LEGACY_SELECTOR_LIMIT = 4095;
var logged = false;

module.exports = function(opt) {
  opt = opt || {};
  opt.throw = opt.throw === undefined ? true : opt.throw;
  opt.log = opt.log === undefined ? true : opt.log;

  return through.obj(function(file, encoding, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      throw new PluginError('gulp-legacy-ie-css-lint', 'Streaming is not supported!');
    }

    var source = file.contents.toString();
    var result = csc(source);

    if (opt.log) {
      if (!logged) {
        gutil.log('Maximum allowed selector per file: ' + gutil.colors.green(LEGACY_SELECTOR_LIMIT));
        logged = true;
      }
      gutil.log(gutil.colors.underline(file.path) + ' contains: ' + gutil.colors.yellow(result.selectors) + ' selector(s)');
    }

    if (result.selectors > LEGACY_SELECTOR_LIMIT) {
      gutil.beep();

      var message = 'Selectors number exceeds the limitation for legacy browsers, styles might lost on IE 9 and below!';
      message += ' Checkout ' + file.path + ' for details.';

      if (opt.throw) {
        throw new PluginError('gulp-legacy-ie-css-lint', message);
      }
      else {
        gutil.log(gutil.colors.red(message));
      }
    }

    cb(null, file);
  }, function(cb) {
    logged = false;
    cb(null);
  });
}
