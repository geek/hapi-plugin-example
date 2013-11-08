var Routes = require('./routes');

exports.register = function (plugin, options, callback) {
    plugin.route(Routes(plugin));
};