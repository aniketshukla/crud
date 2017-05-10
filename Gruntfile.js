module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Configure a mochaTest task
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',// Optionally capture the reporter output to a file
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
          noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
        },
        src: ['test/**/*.js']
      }
    }
  });


  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.registerTask('test','mochaTest');
  grunt.registerTask('server',function(){
      var app=require('./app');
      var done = this.async(),
      _fs = require('fs');

      _fs.watch(process.cwd(), function (event, filename) {
            console.log(event, filename)
        });
  });
  grunt.registerTask('default',['test','server']);

};
