var config = require('./config/primary.json');
var colors = require('colors');
var path = require('path');

var functionalTestRunner = require('./modules/functional-test-runner.js');
var performanceAnalysis = require('./modules/performance-analysis.js');

// Setting up env vars for headless browsers
process.env.PHANTOMJS_EXECUTABLE = __dirname + '/node_modules/.bin/phantomjs';
process.env.SLIMERJS_EXECUTABLE = __dirname + '/node_modules/.bin/slimerjs';

// Setting up specific folders for runners
config.funcSpecsDir = path.join(__dirname, config.funcSpecsDir);


// Runnin functional tests
if (config.runFunctionalTests) {
    functionalTestRunner(config);
} else {

   console.log("Skipping functional tests".magenta);
}

// Running page performance analysis
if (config.pagePerfAnalysis) {
    performanceAnalysis(config);
} else {
   console.log("Skipping page performance analysis".magenta);
}