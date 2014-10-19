var assert = require("chai").assert;
var helpers = require('./integration_helpers');

describe("default languages", function() {

  it('javascript genenerated correctly', function(done) {
    helpers.compare('javascript', ['--css=false', '--html=false'], function(err) {
      assert(err == null, err);
      done();
    });
  });

  it('css genenerated correctly', function(done) {
    helpers.compare('css', ['--js=false', '--html=false'], function(err) {
      assert(err == null, err);
      done();
    });
  });

  it('html genenerated correctly', function(done) {
    helpers.compare('html', ['--js=false', '--css=false'], function(err) {
      assert(err == null, err);
      done();
    });
  });
});
