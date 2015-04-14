var casper = require('casper').create({
    // verbose = true for more debug info
    verbose: false,
    logLevel : 'debug'
});

var utils = require('utils');

var toFile = require('../plugins/to-file.js');

var config = require('../config/primary.json');
var navigation = config.navigation;
var viewports = require('../config/viewports.json');
var takeScreenshot = require('../plugins/take-screenshot.js');
var hosts = config.hosts;
var pages = config.pages;
var address = hosts[casper.cli.args];

// Error counter to detect non 200 @todo separate 3xx , 4xx and 5xx
var errCount = 0;

//detect if this is viewport loop
var viewportLoop = false;
var viewportName = '';

// Creating page load network logs
casper.options.onResourceRequested = function (c, reqData, req) {
    var text = new Date() + ': requested: ' + JSON.stringify(reqData, undefined, 4) + '\n';
    var path = './reports/' + (viewportLoop ? viewportName : '') + '-app-test.log';
    toFile(path, text);
};

casper.options.onResourceReceived = function (c, res) {
    var text = new Date() + ': received: ' + JSON.stringify(res, undefined, 4) + '\n';

    var path = './reports/' + (viewportLoop ? viewportName : '') + '-app-test.log';

    var pathNon200 = './reports/' + (viewportLoop ? viewportName : '') + '-non-200.log';

    if (res.status < 200 || res.status >= 300) {
        toFile(pathNon200, text);
        errCount++;
    }
    toFile(path, text);
};


// Login on Casper start if login is required
if (config.requireLogin) {
  casper.start(address + config.loginLink, function () {
        this.fill(config.loginForm, config.loginCreds, true);
  });
} else {
  casper.start(address, function() {
    casper.echo('Casper Started', 'info');
  });
}

// Performing page load tests for each page in config
casper.each(pages, function(casper, page) {
  errCount = 0;
  casper.echo('Starting test for ' + page.name + ' of ' +  address, 'info');
  if (config.responsiveTest) {
      casper.echo('Starting responsive test');
      viewportLoop = true;
      // If we decided to do "responsive smoke test", we do it for certain list of viewports per page
      casper.each(viewports, function(casper, viewport) {
          var options = {
              viewport: viewport,
              link : address + page.link,
              name : page.name,
              prefix : (config.useGecko) ? 'gecko/' : 'webkit/'
          };

          casper.log('Taking screenshots on emulation', 'debug');
          viewportName = viewport.name;
          takeScreenshot(options, this);

          if (errCount > 0) {
              var errText = "Warning! Received " + errCount + " responses with non-success status code";
              casper.echo(errText, 'error');
          } else {
              casper.echo("Resources for the " + page.name + " loaded cleanly", 'info');
          }
      });
  } else {
      casper.thenOpen( address + page.link, function() {
        if (errCount > 0) {
              var errText = "Warning! Received " + errCount + " responses with non-success status code";
              casper.log(errText, 'error');
          } else {
              casper.log("Resources for the " + page.name + " loaded cleanly", 'info');
          }
      });
  }
});

casper.run();
