var casper = require('casper').create();
var utils = require('utils');

var fs = require('fs');

var config = require('../config/primary.json');
var viewports = require('../config/viewports.json');
var takeScreenshot = require('../plugins/take-screenshot.js');
var hosts = navigation.hosts;
var pages = navigation.pages;
var address = hosts[casper.cli.args];


console.log("Rendering tests");

casper.start(address + 'login', function (){
            this.fill(config.loginForm, config.loginCreds, true);
});

casper.each(pages, function(casper, page) {
  this.echo('Starting test for ' + address + page.name);
  casper.each(viewports, function(casper, viewport) {
      var options = {
          viewport: viewport,
          link : address + page.link,
          name : page.name
      };
      takeScreenshot(options, this);
  });
});

casper.run();
