var fs = require('fs');
/**
 * Writing stuff to file, plugin working in PhantomJS specs and NodeJS
 * @param  {string} path [path to file to write to]
 * @param  {string} text [text to write]
 * @return {void}
 */
var toFile = function(path, text) {
    // If we are in the PhantomJS this case is quite simple
    if (fs.isFile) {
        if( fs.isFile(path) ) {
            fs.write(path, text, "a");
        } else {
            fs.write(path, text, "w");
        }
    } else {
        var stats = false;
        try {
            stats = fs.statSync(path);
        } catch (e) {
            //if file does not exist create
            if (e.code === 'ENOENT') {
                fs.writeFile(path, text, function (err) {
                    if (err) {
                        throw err;
                    }
                });
            }
            else {
                // If something else snapped just throw it
                throw e;
            }
        }
        // File found - append
        if (stats && stats.isFile()) {
            fs.appendFile(path, text, function (err) {
                    if (err) {
                        throw err;
                    }
                });
        }
    }
};

module.exports = toFile;