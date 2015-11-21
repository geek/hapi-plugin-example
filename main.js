'use strict';
const routes = require('./routes');

exports.register = function (server, options, next) {
    server.route(routes(options));
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
