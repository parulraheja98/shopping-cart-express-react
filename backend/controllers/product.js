var product = require('../models/product.js');

addToCart = (req, res, next) => {

    var title = "";
    var price = "";
    product.find({
        _id: req.params.id
    }, function(err, prod) {
        if (err) {
            console.log('debugger 2');
        }
        return prod;

    }).then(function(re) {
        // if cart session undefined create new session
        if (req.session.cart == undefined) {
            req.session.cart = {
                items: [{
                    title: re[0].title,
                    price: re[0].price,
                    inventory_count: re[0].inventory_count,
                    quantity: 1
                }],
                inventory_available: true,
                total_price: re[0].price
            }
        } else {
            /*
            Check if product exist in the cart
            If Product exist in the cart update the quantity
            If Product doesnot exist in create add the product
            to cart with quantity of 1
             */


            var cart_total_price = req.session.cart.total_price;
            var check = true;
            var get_index_of_item;
            var check_cart_item = req.session.cart.items;
            check_cart_item.forEach(function(item, i) {
                if (item.title == re[0].title) {
                    check = false;
                    get_index_of_item = i;
                }
            })


            if (check) {
                var update_price = cart_total_price + re[0].price;
                var create_new_cart_item = {
                    title: re[0].title,
                    price: re[0].price,
                    inventory_count: re[0].inventory_count,
                    quantity: 1
                }
                req.session.cart.total_price = update_price;
                req.session.cart.items.push(create_new_cart_item);
            } else {
                var update_price = cart_total_price + re[0].price;
                update_price = Math.round(update_price * 100) / 100;
                req.session.cart.items[get_index_of_item].quantity += 1;
                req.session.cart.total_price = update_price;


            }
        }

        res.json({
            completed: true
        });


    })

}

createsampleproducts = (req, res, next) => {
    var products = [{
            title: 'test-product-1',
            price: 20,
            inventory_count: 10
        },
        {
            title: 'test-product-2',
            price: 10,
            inventory_count: 20
        },
    ];

    products.forEach(function(n, i) {

        product.update({
                title: n.title
            }, {
                $setOnInsert: n
            }, {
                upsert: true
            },
            function(err, numAffected) {
                console.log("Update Completed ");
            }
        );

        if (i == products.length - 1)
            productsCreated(req, res, next);


    })

}

productsCreated = (req, res, next) => {
    res.redirect(303, '/fetchproducts');
}

fetchproducts = (req, res, next) => {
    product.find({}, function(err, prod) {
        return res.json({
            productsForDisplay: prod
        })
    })
}

createcustomproduct = (req, res, next) => {

    product.find({
        title: req.body.title
    }, function(err, prod) {

    }).then(function(resProduct) {

        if (resProduct.length <= 0) {
            newproduct = product({
                title: req.body.title,
                price: parseFloat(req.body.price),
                inventory_count: parseInt(req.body.inventory)
            });
            newproduct.save();
            res.redirect('/fetchproducts');
        } else {
            res.json({
                message: 'product already exists'
            })
        }
    })
}

productpage = (req, res, next) => {
    res.redirect(303, '/createsampleproducts');
}

deletecustomproducts = (req, res, next) => {
    product.remove({}, function(err, products) {
        if (!err)
            res.json({
                message: 'Custom product deleted'
            })
        else {
            res.json({
                message: 'Product Delete Failed'
            })
        }
    })
}

module.exports = {
    deletecustomproducts,
    productpage,
    createcustomproduct,
    fetchproducts,
    productsCreated,
    createsampleproducts,
    addToCart

}