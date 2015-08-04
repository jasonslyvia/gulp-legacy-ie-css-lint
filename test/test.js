var chai = require('chai');
var fs = require('fs');
var gutil = require('gulp-util');
var File = require('vinyl');
var legacyIeCssLint = require('../');
var expect = chai.expect;

describe('gulp-legacy-ie-css-lint', function() {
  it('should not throw for normal CSS', function() {
    var file = fs.readFileSync('./test/fixtures/normal.css');
    var buffer = new Buffer(file);

    var fakeFile = new File({
      contents: buffer,
      path: '/some/fake/path/normal.css'
    });

    var myPlugin = legacyIeCssLint();

    expect((function(){
      myPlugin.write(fakeFile);
    })).not.to.throw();
  });

  it('should throw for large CSS that exceeds selector limit', function() {
    var file = fs.readFileSync('./test/fixtures/large.css');
    var buffer = new Buffer(file);

    var fakeFile = new File({
      contents: buffer,
      path: '/some/fake/path/large.css'
    });

    var myPlugin = legacyIeCssLint();

    expect((function(){
      myPlugin.write(fakeFile);
    })).to.throw();
  });

  it('should not throw if option.throw is set to false', function() {
    var file = fs.readFileSync('./test/fixtures/large.css');
    var buffer = new Buffer(file);

    var fakeFile = new File({
      contents: buffer,
      path: '/some/fake/path/large.css'
    });

    var myPlugin = legacyIeCssLint({
      throw: false
    });

    expect((function(){
      myPlugin.write(fakeFile);
    })).not.to.throw();
  });

  it('should log nothing if option.log is set to false', function() {
    var file = fs.readFileSync('./test/fixtures/normal.css');
    var buffer = new Buffer(file);

    var fakeFile = new File({
      contents: buffer,
      path: '/some/fake/path/normal.css'
    });

    var myPlugin = legacyIeCssLint({
      log: false
    });

    var hook = captureStream(process.stdout);

    myPlugin.write(fakeFile);

    expect(hook.captured()).to.equal('');

    hook.unhook();
  });
});


function captureStream(stream){
  var oldWrite = stream.write;
  var buf = '';
  stream.write = function(chunk, encoding, callback){
    buf += chunk.toString(); // chunk is a String or Buffer
    oldWrite.apply(stream, arguments);
  }

  return {
    unhook: function unhook(){
     stream.write = oldWrite;
    },
    captured: function(){
      return buf;
    }
  };
}
