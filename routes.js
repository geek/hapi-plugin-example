'use strict';

module.exports = function routes (options) {
    const Joi = require('joi');
    return [
        { method: 'GET', path: '/products',
            config: {
                handler: getProducts,
                validate: { query: { name: Joi.string() } } } },
        { method: 'GET', path: '/products/{id}', config: { handler: getProduct } },
        { method: 'POST', path: '/products', config: {
            handler: addProduct,
            validate: {payload:  Joi.string().required().min(3)}
        } }
    ];
};


function getProducts(request, reply) {
    if (request.query.name) {
        reply(findProducts(request.query.name));
    } else {
        reply(products);
    }
}

function findProducts(name) {
    return products.filter(function(product) {
        return product.name.toLowerCase() === name.toLowerCase();
    });
}

function getProduct(request, reply) {
    const product = products.filter(function(p) {
        return p.id == request.params.id;
    }).pop();

    reply(product);
}

function addProduct(request, reply) {
    const product = {
        id: products[products.length - 1].id + 1,
        name: request.payload.name
    };

    products.push(product);

    reply.created('/products/' + product.id)({
        id: product.id
    });
}

const products = [{
    id: 1,
    name: 'Guitar'
},
    {
        id: 2,
        name: 'Banjo'
    }
];
