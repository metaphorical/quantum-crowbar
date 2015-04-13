var fs = require('fs');
/**
 * Take Screenshot of certain page
 * @param  {Object}              options             -  list of options
 * @param  {CasperObject}   casperContext   - running casper instance context (this inside casper start callback)
 * @return   {void}
 */
var snap = function(options, casperContext) {
    var viewport = options.viewport;
    var name = options.name;
    var link = options.link;
    var prefix = options.prefix || '';
    // For page screenshot to be accurate we might want to wait for async loaded images to load
    var waitTime = options.wait || 5000;
    var snapsFolder = options.folder || 'screenshots/';

      casperContext.then(function() {
        this.viewport(viewport.viewport.width, viewport.viewport.height);
      });
      casperContext.thenOpen( link, function() {
        this.wait(waitTime);
      });
      casperContext.then(function() {
        this.echo(viewport.name + ' (' + viewport.viewport.width + 'x' + viewport.viewport.height + ')', 'info');
        this.capture(snapsFolder + prefix + name + '/' + viewport.name + '-' + viewport.viewport.width + 'x' + viewport.viewport.height + '.png', {
            top: 0,
            left: 0,
            width: viewport.viewport.width,
            height: viewport.viewport.height
        });
      });
};

module.exports = snap;