var fs = require('fs');

var snap = function(options, casperContext) {
    var viewport = options.viewport,
    name = options.name,
    link = options.link,
    prefix = options.prefix ? options.prefix : '';

      casperContext.then(function() {
        this.viewport(viewport.viewport.width, viewport.viewport.height);
      });
      casperContext.thenOpen( link, function() {
        this.wait(5000);
      });
      casperContext.then(function(){
        this.echo('Screenshot for ' + viewport.name + ' (' + viewport.viewport.width + 'x' + viewport.viewport.height + ')', 'info');
        this.capture('screenshots/'  + prefix + name + '/' + viewport.name + '-' + viewport.viewport.width + 'x' + viewport.viewport.height + '.png', {
            top: 0,
            left: 0,
            width: viewport.viewport.width,
            height: viewport.viewport.height
        });
      });
};

module.exports = snap;