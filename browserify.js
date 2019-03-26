var browserify = require('browserify');
var fs = require('fs');
var common_paths = require('./node_modules/hslayers-ng/common_paths');
common_paths.paths.push(__dirname);
var b = browserify({
    paths: common_paths.paths
});
var bundleFs = fs.createWriteStream(__dirname + '/bundle.js')
b.add(__dirname + '/app.js');
b.transform('exposify', {
    global: true,
    expose: {
        jquery: '$'
    }
});
b.transform('deamdify', {
    global: true
});
b.bundle().pipe(bundleFs);
