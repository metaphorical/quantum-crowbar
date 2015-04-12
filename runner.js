var config = require('./config/primary.json');
var path = require('path');
var childProcess = require('child_process');
var casperPath = 'node_modules/.bin/casperjs';
var fs = require('fs');
var colors = require('colors');


if (config.runFunctionalTests) {
    console.log("Functional tests are being executed".yellow);
    fs.readdir('./' + config.specsDir, function(err, files) {
        if (err) {
            console.log("There has been an error");
            console.log("error: ", err);
        } else {
            files.forEach(function(file, index) {
                        var childArgs = [
                          path.join(__dirname, config.specsDir + '/' + file),
                          process.argv[2],
                          '--web-security=no'
                        ];
                        if (config.useGecko) {
                            childArgs.push('--engine=slimerjs');
                        }

                        process.env.PHANTOMJS_EXECUTABLE = __dirname + '/node_modules/.bin/phantomjs';
                        process.env.SLIMERJS_EXECUTABLE = __dirname + '/node_modules/.bin/slimerjs';
                        console.log(file.red);
                        var casperProcess = childProcess.execFile(casperPath, childArgs, function(err, stdout, stderr) {
                            if (err) {
                                console.log("Error happend".red);
                                console.log("err: ", err);
                                console.log("stderr", stderr);
                            }
                            console.log(stdout.cyan);
                        });

                        // Detaching child process event loop from parents event loop
                        casperProcess.unref();

                        casperProcess.stdout.on('data', function(data) {
                            console.log(data.toString());
                        });
                }
            );
        }
    });
} else {
   console.log("Skipping functional tests".magenta);
}