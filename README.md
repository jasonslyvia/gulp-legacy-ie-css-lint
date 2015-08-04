# gulp-legacy-ie-css-lint

A Gulp plugin that ensure your CSS won't be discarded by IE 9 and below because of crazy stylesheets limitation of legacy IE.

## Usage

```
var gulp = require('gulp');
var legacyIeCssLint = require('gulp-legacy-ie-css-lint');

gulp.task('style', function() {
  gulp.src('./src/css/style.css')
  .pipe(legacyIeCssLint({
    throw: true,
    log: true
  }))
  .pipe(gulp.dest('./build'));
});
```

## Options

### throw

Type: Bool

Default: true

When the selector count of a single stylesheet exceed 4095, throw a error so that the gulp task is stopped.

### log

Type: Bool

Default: true

Log rules count and selector count for every file passed to `gulp-legacy-ie-css-lint`.

## Scripts

```
$ npm run test
$ npm run coverage
```

## License

MIT
