const product = require('../models/product.js');

async function addProductToCart(id) {
    return new Promise((resolve, reject) => {
        product.find({ _id: id }, (err, resp) => {
            if (err) reject(err);
            else resolve(resp);
        });
    });
}

addToCart = async (req, res) => {
    const title = '';
    const price = '';
    const productById = await addProductToCart(req.params.id);
    if (productById) {
        // if cart session undefined create new session
        if (req.session.cart === undefined) {
            req.session.cart = {
                items: [{
                    title: re[0].title,
                    price: re[0].price,
                    inventory_count: re[0].inventory_count,
                    quantity: 1,
                }],
                inventory_available: true,
                total_price: re[0].price,
            };
        } else {
            /*
                    Check if product exist in the cart
                    If Product exist in the cart update the quantity
                    If Product doesnot exist in create add the product
                    to cart with quantity of 1
                  */


            const cartTotalPrice = req.session.cart.total_price;
            const productInCart = true;
            let get_index_of_item;
            const check_cart_item = req.session.cart.items;
            check_cart_item.forEach((item, i) => {
                if (item.title == re[0].title) {
                    check = false;
                    get_index_of_item = i;
                }
            });

            if (productInCart) {
                var updatedPrice = cartTotalPrice + re[0].price;
                updatedPrice = Math.round(updatedPrice * 100) / 100;
                req.session.cart.items[get_index_of_item].quantity += 1;
                req.session.cart.total_price = updatedPrice;
            } else {
                var updatedPrice = cartTotalPrice + re[0].price;
                req.session.cart.total_price = updatedPrice;
                req.session.cart.items.push({
                    title: re[0].title,
                    price: re[0].price,
                    inventory_count: re[0].inventory_count,
                    quantity: 1,
                });
            }
        }
    } else {
        res.status(500).json({
            error: 'Product with the id doesnot exist',
        });
    }
};

createsampleproducts = (req, res) => {
    const products = [{
        title: 'test-product-1',
        price: 20,
        inventory_count: 10,
    },
    {
        title: 'test-product-2',
        price: 10,
        inventory_count: 20,
    },
    ];

    products.forEach((n, i) => {
        product.update({
            title: n.title,
        }, {
            $setOnInsert: n,
        }, {
            upsert: true,
        },
            (err, numAffected) => {
                console.log('Update Completed ');
            });

        if (i === products.length - 1) fetchproducts(req, res);
    });
};


async function fetchProducts() {
    return new Promise((resolve, reject) => {
        product.find({}, (err, prod) => {
            if (err) reject(err);
            else resolve(prod);
        });
    });
}

createcustomproduct = (req, res) => {
    product.find({
        title: req.body.title,
    }, async (err, resProduct) => {
        if (resProduct.length <= 0) {
            newproduct = product({
                title: req.body.title,
                price: parseFloat(req.body.price),
                inventory_count: parseInt(req.body.inventory),
            });
            newproduct.save();
            const fetchAllProducts = await fetchProducts();
            return fetchAllProducts;
        }
        res.json({
            message: 'product already exists',
        });
    });
};


deletecustomproducts = (req, res) => {
    product.remove({}, (err, products) => {
        if (!err) {
            res.status(200).json({
                message: 'Custom product deleted',
            });
        } else {
            res.status(200).json({
                message: 'Product Delete Failed',
            });
        }
    });
};

productWithInventory = (req, res) => {
    if (req.params.check === 'available') {
        product.find({
            inventory_count: {
                $gt: 0,
            },
        }, (error, products) => {
            if (error) {
                res.status(500).json({
                    error,
                });
            } else {
                res.json({
                    productsForDisplay: products,
                });
            }
        });
    } else {
        window.location.href = '/notfound';
    }
};


module.exports = {
    deletecustomproducts,
    createcustomproduct,
    fetchproducts,
    createsampleproducts,
    productWithInventory,
    addToCart,

};
