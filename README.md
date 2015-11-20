Hapi Plugin Example
===================

[Hapi](http://hapijs.com/) is a framework for rapidly building RESTful web services. Whether you
are building a very simple set of RESTful services or a large scale, cache
heavy, and secure set of services, `hapi` has you covered.  [Hapi](http://hapijs.com/) will
help get your server developed quickly with its wide range of configurable options.

## Building a Products API

The following example will walk you through using hapi to build a RESTful set
of services for creating and listing out products. To get started create a
directory named _products_ and add a `package.json` file to the directory
that looks like the following.

```json
{
  "name": "products",
  "version": "0.0.1",
  "engines": {
    "node": ">=4.0.0"
  },
  "peerDependencies": {
    "hapi": "11.x.x"
  }
}
```

Create a `main.js` file that will serve as the entry point for the plugin.  Add the following to the file:

```js
var routes = require('./routes');

exports.register = function (server, options, next) {
    server.route(routes(options));
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

```

[Hapi](http://hapijs.com/) provides a function for adding a single route or an
array of routes. In this example we are adding an array of routes from a routes module.

Go ahead and create a `routes.js` file, which will contain the route
information and handlers. When defining the routes we will also be specifying
*validation requirements*.

For this example three routes will be created. Below is the code you should
use to add the routes. Add the following code to your `routes.js` file.

```js
module.exports = function routes (options) {
    var Joi = require('joi');
    return [
        { method: 'GET', path: '/products', config: { handler: getProducts, query: { name: Joi.string() } } },
        { method: 'GET', path: '/products/{id}', config: { handler: getProduct } },
        { method: 'POST', path: '/products', config: {
            handler: addProduct,
            payload: 'parse',
            schema:  Joi.string().required().min(3) ,
            response: { id: Joi.number().required() }
        } }
    ];
};
```

The routes are exported as an array so that they can easily be included by the
plugin register function. For the products listing endpoint we are
allowing a querystring parameter for name. When this querystring parameter
exists then we will filter the products for those that have a matching name.

The second route is a very simple route that demonstrates how a parameter can
become part of the path definition. This route will return a product matching
the ID that’s requested.

In the last route, the one used for creating a product, you will notice that
extra validation requirements are added, even those on the response body. The
request body must contain a parameter for name that has a minimum of 3
characters and the response body must contain an ID to be validated.

Next add the handlers to the `routes.js` file.

```js
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
    var product = products.filter(function(p) {
        return p.id == request.params.id;
    }).pop();

    reply(product);
}

function addProduct(request, reply) {
    var product = {
        id: products[products.length - 1].id + 1,
        name: request.payload.name
    };

    products.push(product);

    reply.created('/products/' + product.id)({
        id: product.id
    });
}
```

As you can see in the handlers, *hapi* provides a simple way to add a
response body by using the `reply function`. Also, in the instance
when you have created an item you can use the `reply.created` function
to send a 201 response.

Lastly, add a simple array to contain the products that the service will serve.

```js
var products = [{
       id: 1,
       name: 'Guitar'
   },
   {
       id: 2,
       name: 'Banjo'
   }
];
```
    

## Composing the server

The plugin can now be added to a server using a `config.json` file.  Create a `config.json`
file outside of the plugin directory in a new directory you plan to run the server.  Add
the following contents to `config.json`

```json
{
    "servers": [
        {
            "host": "0.0.0.0",
            "port": 8080,
            "options": {
                "labels": ["http", "api"]
            }
        }
    ],
    "plugins": {
        "products": {}
    }
}
```

Next run `npm link` within the products folder and then run `npm link products` inside the folder where
the `config.json` exists.  After this you will want to also run `npm install -g hapi` to install hapi.

## Running the server

Start the hapi server using the following command:

    hapi -c config.json

To see a list of the products navigate to
<http://locahost:8080/products>. Below is a screenshot of what the response
looks like.

<img src="https://raw.github.com/wpreul/hapi-example/master/images/products.png" height="75px" width="auto" />

Go ahead and append `?name=banjo` to the URL to try searching for a product by
name.

<img src="https://raw.github.com/wpreul/hapi-example/master/images/banjo.png" height="75px" width="auto" />

Use curl or a REST console to create a product. Make a POST request to the
products endpoint with a name in the body. Using curl the command looks like:
`curl http://localhost:8080/products -d "name=test"`. Below is an example of
the response headers from making a request to create a product.

<img src="https://raw.github.com/wpreul/hapi-example/master/images/headers.png" height="225px" width="auto" />

Now if you navigate to the _Location_ specified in the response headers you
should see the product that you created.

## Other features

There are a lot of different configuration features that you can add to the
server.  The extensive list can be found in the readme at
<http://hapijs.com>.

The built-in cache support has providers for mongo and redis. Setting up cache
is as simple as passing cache: true as part of the server configuration.

Additionally, there are several configuration options available on a per route
basis. For example, caching expiration times can also be configured on a per route basis. Also,
you can have per-route authentication settings.

## Conclusion

By now you should have a decent understanding of what *hapi* has to offer.

There are still many other features and options available to you when using
hapi that is covered in the documentation.  Please take a look at the
[github repository][] and feel free to provide any feedback you may have.

[github repository]: https://github.com/wpreul/hapi-plugin-example
