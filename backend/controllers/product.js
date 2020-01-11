const product = require('../models/product.js');
const findProductByTitle = require('./db/product.js').findProductByTitle;
const fetchProducts = require('./db/product.js').fetchProducts;

async function addProductToCart(id) {
    return new Promise((resolve, reject) => {
        product.find({ _id: id }, (err, resp) => {
            if (err) reject(err);
            else resolve(resp);
        });
    });
}

async function createSampleProducts(prod) {
    return new Promise((resolve, reject) => {

        product.update({
            title: prod.title,
        }, {
            $setOnInsert: prod,
        }, {
            upsert: true,
        },
            (err, prodUpdated) => {
                console.log('Update Completed ');
                if (err) {
                    reject(err);
                }
                else {
                    resolve(prodUpdated)
                }

            })
    });

}

addToCart = async (req, res, next) => {
    var title = '';
    var price = '';
    var productById = await addProductToCart(req.params.id);
    if (productById) {
        // if cart session undefined create new session
        if (!req.session.cart) {
            req.session.cart = {
                items: [{
                    title: productById[0].title,
                    price: productById[0].price,
                    inventory_count: productById[0].inventory_count,
                    quantity: 1,
                }],
                inventory_available: true,
                total_price: productById[0].price,
            };
        } else {
            /*
                Check if product exist in the cart
                If Product exist in the cart update the quantity
                If Product doesnot exist in create add the product
                to cart with quantity of 1
            */

            var cartTotalPrice = req.session.cart.total_price;
            let productInCart = false;
            var get_index_of_item;
            var check_cart_item = req.session.cart.items;
            check_cart_item.forEach((item, i) => {
                if (item.title == productById[0].title) {
                    productInCart = true;
                    get_index_of_item = i;
                }
            });

            if (productInCart) {
                var updatedPrice = cartTotalPrice + productById[0].price;
                updatedPrice = Math.round(updatedPrice * 100) / 100;
                req.session.cart.items[get_index_of_item].quantity += 1;
                req.session.cart.total_price = updatedPrice;
            } else {
                var updatedPrice = cartTotalPrice + productById[0].price;
                req.session.cart.total_price = updatedPrice;
                req.session.cart.items.push({
                    title: productById[0].title,
                    price: productById[0].price,
                    inventory_count: productById[0].inventory_count,
                    quantity: 1,
                });
            }
        }
        res.json({
            message: 'Cart Session Created'
        })
    } else {
        res.status(500).json({
            error: 'Product with the id doesnot exist',
        });
    }
};

createsampleproducts = async (req, res, next) => {
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
    for (prod of products) {
        var createProduct = await createSampleProducts(prod);
    }
    const getAllProducts = await fetchProducts();
    res.json(getAllProducts);
};

createcustomproduct = async (req, res, next) => {
    const productExistWithTitle = await findProductByTitle(req.body.title);
    if (!productExistWithTitle.length) {
        newProduct = product({
            title: req.body.title,
            price: parseFloat(req.body.price),
            inventory_count: parseInt(req.body.inventory),
        });
        newProduct.save();
        res.json(await fetchProducts());
    }
    else {
        res.json({
            message: 'product already exists',
        });
    }
};


deletecustomproducts = (req, res, next) => {
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

productWithInventory = (req, res, next) => {
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
    createsampleproducts,
    productWithInventory,
    addToCart
};
