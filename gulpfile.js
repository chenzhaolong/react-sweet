const gulp = require('gulp');
const ts = require('gulp-typescript');
const watch = require('gulp-watch');
const tsConfig = require('./tsconfig');
//
// 修改tsConfig的输出地址
tsConfig.compilerOptions.outDir = '';

function w(path, task){
  watch(path, function () {
    gulp.start(task);
  });
}

gulp.task('compilerSrc', () => {
  const tsResult = gulp.src("src/**/*.ts")
    .pipe(ts(tsConfig.compilerOptions));
  return tsResult.js.pipe(gulp.dest('example/react-sweet/src'));
});

gulp.task('compilerCli', () => {
  const tsResult = gulp.src("cli/**/*.ts")
    .pipe(ts(tsConfig.compilerOptions));
  return tsResult.js.pipe(gulp.dest('example/react-sweet/cli'));
});

gulp.task('watch', () => {
  w('src/**/*.ts', 'compilerSrc');
  w('cli/**/*.ts', 'compilerCli');
});

gulp.task('compiler', ['compilerSrc', 'compilerCli', 'watch']);