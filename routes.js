module.exports = function (plugin) {
    var types = plugin.hapi.types;

    return [
        { method: 'GET', path: '/products', config: { handler: getProducts, query: { name: types.string() } } },
        { method: 'GET', path: '/products/{id}', config: { handler: getProduct } },
        { method: 'POST', path: '/products', config: { handler: addProduct, payload: 'parse', schema: { name: types.string().required().min(3) }, response: { id: types.number().required() } } }
    ];
};


function getProducts(request) {

    if (request.query.name) {
        request.reply(findProducts(request.query.name));
    }
    else {
        request.reply(products);
    }
}

function findProducts(name) {
    return products.filter(function(product) {
        return product.name.toLowerCase() === name.toLowerCase();
    });
}

function getProduct(request) {
    var product = products.filter(function(p) {
        return p.id == request.params.id;
    }).pop();

    request.reply(product);
}

function addProduct(request) {
    var product = {
        id: products[products.length - 1].id + 1,
        name: request.payload.name
    };

    products.push(product);

    request.reply.created('/products/' + product.id)({
        id: product.id
    });
}

var products = [{
    id: 1,
    name: 'Guitar'
},
    {
        id: 2,
        name: 'Banjo'
    }
];