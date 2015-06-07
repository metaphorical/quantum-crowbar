var pa11y = require('pa11y');
var _ = require('lodash');

var toFile = require('../plugins/to-file.js');


var at = function(options) {
	var reportFile = (options.reportFolder || './reports/') + (options.name || options.url.replace(/(www|http|https|\.|:|\/\/|\/)/g, '')) + '-' + (options.pageName) + '.json'; 
	pa11y.sniff({
		url: options.url
	}, function(err, result) {
		if (err) {
			console.log('Error! ', err);
		} else {
			toFile(reportFile, JSON.stringify(result, null, 4));
		}
	});
};

var AccessibilityTest = function (config, host) {
	var path = process.env.PATH;
	//@TODO please fix this path to be right
	var phantomPath = __dirname + '/../node_modules/.bin';
	if (path.indexOf(phantomPath)) {
		path = path + ':' + phantomPath;
		process.env.PATH = path;
		process.env.PHANTOM_JS = phantomPath;
	}
	
	var pages = config.pages
	_.each(pages, function(page){
		at({
			url: config.hosts[process.argv[2]] + page.link,
			name: config.appName,
			pageName: page.name,
		});
	});
};

module.exports = AccessibilityTest;