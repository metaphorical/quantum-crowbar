
var casper = require('casper').create();
var utils = require('utils');

var fs = require('fs');

var hosts = require('../config/primary.json').hosts;


console.log("Page resources test");

var address = hosts[casper.cli.args];

var toFile = function(path, text) {
    if( fs.isFile(path)) {
            fs.write(path, text, "a");
        } else {
            fs.write(path, text, "w");
        }
};

casper.options.viewportSize = {width: 1200,height: 1200};

var errCount = 0;
casper.options.onResourceRequested = function (c, reqData, req) {
    var text = new Date() + ': requested: ' + JSON.stringify(reqData, undefined, 4) + '\n';
    toFile('./logs/casper-test.log', text);
};

casper.options.onResourceReceived = function (c, res) {
    var text = new Date() + ': received: ' + JSON.stringify(res, undefined, 4) + '\n';
    if (res.status < 200 || res.status >= 300) {
        errCount++;
    }
    toFile('./logs/casper-test.log', text);
};

casper.start(address + 'login', function (){
            if (errCount > 0) {
                var errText = "Warning! Received " + errCount + " responses with non-success status code";
                console.log(errText);
            } else {
                console.log("Resources for the page loaded cleanly");
            }
            this.fill('form[name="login"]', {
                username: 'xnaud@vast.com',
                password: 'qa123'
            }, true);
});

// casper.each();

casper.then(function() {
    console.log(this.getCurrentUrl());
});

casper.run();
