var config = require('./config/primary.json');
var path = require('path');
var childProcess = require('child_process');
var casperPath = 'node_modules/.bin/casperjs';
var fs = require('fs');
var colors = require('colors');

process.env.PHANTOMJS_EXECUTABLE = __dirname + '/node_modules/.bin/phantomjs';
process.env.SLIMERJS_EXECUTABLE = __dirname + '/node_modules/.bin/slimerjs';


if (config.runFunctionalTests) {
    console.log("Functional tests are being executed".yellow);
    fs.readdir('./' + config.specsDir, function(err, files) {
        if (err) {
            console.log("There has been an error");
            console.log("error: ", err.red);
        } else {
            files.forEach(function(file, index) {
                        var filePath = path.join(__dirname, config.specsDir + '/' + file);
                        var childArgs = [
                          path.join(__dirname, config.specsDir + '/' + file),
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
} else {
   console.log("Skipping functional tests".magenta);
}

if (config.pagePerfAnalysis) {

} else {
   console.log("Skipping page performance analysis".magenta);
}