var fs = require('fs');
/**
 * Writing stuff to file
 * @param  {string} path [path to file to write to]
 * @param  {string} text [text to write]
 * @return {void}
 */
var toFile = function(path, text) {
    if( fs.isFile(path)) {
            fs.write(path, text, "a");
        } else {
            fs.write(path, text, "w");
        }
};

module.exports = toFile;