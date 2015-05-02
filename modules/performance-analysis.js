var _ = require('lodash');
var path = require('path');
var childProcess = require('child_process');
var colors = require('colors');


var toFile = require('../plugins/to-file.js');
var phantomPath = './node_modules/.bin/phantomjs';
var confessPath = './plugins/confess/confess.js';
var yslowPath = './plugins/yslow.js';

var runPhantomChildProcess = function(args) {
    var phantomProc = childProcess.execFile(phantomPath, args, function(err, stdout, stderr) {
            if (err) {
                console.log("Error happend".red);
                console.log("err: ", err.red);
                console.log("stderr", stderr.red);
            } else {
                console.log("Successfully finished".green);
            }
        });
    return phantomProc;
};
var performanceAnalysis = function(config) {
    console.log("Performance analyses started".yellow);
    var pages = config.pages;
    var reportFolder = config.reportFolder || "./reports/"

    _.each(pages, function(page) {
        var pageLink = config.hosts[process.argv[2]] + page.link;
        var reportFile = reportFolder + config.appName + '-' + process.argv[2] + '-' + page.name;
        var appcacheArgs = [
                      confessPath,
                      pageLink,
                      'appcache'
                    ];
        var performanceArgs = [
                      confessPath,
                      pageLink,
                      'performance'
                    ];
        var yslowArgs = [
                      yslowPath,
                      '-i',
                      'grade', 
                      '-threshold', 
                      '"B"',
                      '-f', 
                      'tap',
                      pageLink
                    ];

        console.log("\nGenerating appcache manifest of:".bold);
        console.log(page.name.yellow + "\n");
        var confessAppcache = runPhantomChildProcess(appcacheArgs);
        // Detaching child process event loop from parents event loop
        confessAppcache.unref();

        confessAppcache.stdout.on('data', function(data) {
            toFile(reportFile +'.appcache', data.toString());
        });


        console.log("\nGenerating performance report for:".bold);
        console.log(page.name.yellow + "\n");
        var confessPerf = runPhantomChildProcess(performanceArgs);
        // Detaching child process event loop from parents event loop
        confessPerf.unref();

        confessPerf.stdout.on('data', function(data) {
            toFile(reportFile +'-performance.log', data.toString());
        });


        console.log("\nGenerating yslow report for:".bold);
        console.log(page.name.yellow + "\n");
        var yslowTask = runPhantomChildProcess(yslowArgs);
        // Detaching child process event loop from parents event loop
        yslowTask.unref();

        yslowTask.stdout.on('data', function(data) {
            toFile(reportFile + '-yslow.tap', data.toString());
        });


    });
};

module.exports = performanceAnalysis;