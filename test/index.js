var expect = require('chai').expect,
    browserify = require('browserify'),
    vm = require('vm'),
    path = require('path'),
    debowerify = require('..'),
    fs = require('fs');

describe('debowerify', function() {

  it('should be able to debowerify a basic file from dependencies', function(done) {
    var jsPath = path.join(__dirname, '..', 'public', 'index.js');
    var b = browserify();
    b.add(jsPath);
    b.transform(debowerify);
    b.bundle(function (err, src) {
      if (err) return done(err);
      vm.runInNewContext(src, {
        console: {
          log: function (msg) {
            expect(msg).to.equal('hello, world');
            done();
          }
        }
      });
    });
  });

  it('should be fail to debowerify a basic file from dependencies without options', function(done) {
    var jsPath = path.join(__dirname, '..', 'public', 'index.chicken');
    var b = browserify();
    b.add(jsPath);
    b.transform(debowerify);
    b.bundle(function (err, src) {
      expect(err).to.not.be.false;
      done();
    });
  });

  it('should be able to debowerify a basic file from dependencies with options', function(done) {
    var jsPath = path.join(__dirname, '..', 'public', 'index.chicken');
    var b = browserify();
    b.add(jsPath);
    debowerify.extensions.push('chicken');
    b.transform(debowerify);
    b.bundle(function (err, src) {
      if (err) return done(err);
      vm.runInNewContext(src, {
        console: {
          log: function (msg) {
            expect(msg).to.equal('hello, world');
            done();
          }
        }
      });
    });
  });

  it('should be able to debowerify a basic file from devDependencies', function(done) {
    var jsPath = path.join(__dirname, '..', 'public', 'base62test.js');
    var b = browserify();
    b.add(jsPath);
    b.transform(debowerify);
    b.bundle(function (err, src) {
      if (err) return done(err);
      vm.runInNewContext(src, {
        console: {
          log: function (msg) {
            expect(msg).to.equal(12345);
            done();
          }
        }
      });
    });
  });

  it('should be able to debowerify a submodule', function(done) {
    var jsPath = path.join(__dirname, '..', 'public', 'by_subpath.js');
    var b = browserify();
    b.add(jsPath);
    b.transform(debowerify);
    b.bundle(function (err, src) {
      if (err) return done(err);
      vm.runInNewContext(src, {
        console: {
          log: function (msg) {
            expect(msg).to.equal(12345);
            done();
          }
        }
      });
    });
  });

  it('should be able to debowerify a module with other dependencies', function(done) {
    var b = browserify();
    b.add(path.join(__dirname, '..', 'public', 'deep_dependencies_test.js'));
    b.transform(debowerify);
    b.bundle(function (err, src) {
      if (err) return done(err);
      vm.runInNewContext(src);
      done();
    });
  });

});
