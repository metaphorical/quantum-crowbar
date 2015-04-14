
var path = require('path');
var childProcess = require('child_process');
var casperPath = 'node_modules/.bin/casperjs';
var fs = require('fs');
var colors = require('colors');

var functionalTestRunner = function(config) {
    console.log("Functional tests are being executed".yellow);
    fs.readdir(config.funcSpecsDir, function(err, files) {
        if (err) {
            console.log("There has been an error");
            console.log("error: ", err.red);
        } else {
            files.forEach(function(file, index) {
                        var childArgs = [
                          path.join(config.funcSpecsDir + '/' + file),
                          process.argv[2],
                          '--web-security=no'
                        ];
                        if (config.useGecko) {
                            childArgs.push('--engine=slimerjs');
                        }

                        console.log("\nExecuting:".bold);
                        console.log(file.yellow + "\n");
                        var casperProcess = childProcess.execFile(casperPath, childArgs, function(err, stdout, stderr) {
                            if (err) {
                                console.log("Error happend".gray);
                                console.log("err: ", err.red);
                                console.log("stderr", stderr.red);
                            } else {
                                console.log("Successfully finished".green);
                            }
                        });

                        // Detaching child process event loop from parents event loop
                        casperProcess.unref();

                        casperProcess.stdout.on('data', function(data) {
                            console.log(data.toString().cyan);
                        });
                }
            );
        }
    });
};

module.exports = functionalTestRunner;