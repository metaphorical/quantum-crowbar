var casper = require('casper').create({
    verbose: true,
    logLevel : 'debug'
});

var utils = require('utils');

var fs = require('fs');

var config = require('../config/primary.json');
var navigation = config.navigation;
var viewports = require('../config/viewports.json');
var takeScreenshot = require('../plugins/take-screenshot.js');
var hosts = config.hosts;
var pages = config.pages;
var address = hosts[casper.cli.args];

var errCount = 0;
var toFile = function(path, text) {
    if( fs.isFile(path)) {
            fs.write(path, text, "a");
        } else {
            fs.write(path, text, "w");
        }
};

casper.options.onResourceRequested = function (c, reqData, req) {
    var text = new Date() + ': requested: ' + JSON.stringify(reqData, undefined, 4) + '\n';
    toFile('./logs/app-test.log', text);
};

casper.options.onResourceReceived = function (c, res) {
    var text = new Date() + ': received: ' + JSON.stringify(res, undefined, 4) + '\n';
    if (res.status < 200 || res.status >= 300) {
        toFile('./logs/non-200.log', text);
        errCount++;
    }
    toFile('./logs/app-test.log', text);
};

if (config.requireLogin) {
  casper.start(address + config.loginLink, function () {
        this.fill(config.loginForm, config.loginCreds, true);
  });
} else {
  casper.start(address, function() {
    casper.log('Casper Started', 'debug');
  });
}

casper.each(pages, function(casper, page) {
  errCount = 0;
  casper.log('Starting test for ' + address + page.name, 'debug');
  if (config.responsiveTest) {
      casper.each(viewports, function(casper, viewport) {
          var options = {
              viewport: viewport,
              link : address + page.link,
              name : page.name,
              prefix : (config.useGecko) ? 'gecko/' : 'webkit/'
          };
          casper.log('Taking screenshots of ' + page.name + ' on emulation of ' + viewport.name, 'debug');
          takeScreenshot(options, this);
          if (errCount > 0) {
              var errText = "Warning! Received " + errCount + " responses with non-success status code";
              casper.log(errText, 'error');
          } else {
              casper.log("Resources for the " + page.name + " loaded cleanly");
          }
      });
  } else {
      casper.thenOpen( address + page.link, function() {
        if (errCount > 0) {
              var errText = "Warning! Received " + errCount + " responses with non-success status code";
              casper.log(errText, 'error');
          } else {
              casper.log("Resources for the " + page.name + " loaded cleanly");
          }
      });
  }
});

casper.run();
