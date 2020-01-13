var product = require('../models/product.js');
const findProductByTitle = require('./db/product.js').findProductByTitle;
const updateProductByTitle = require('./db/product.js').updateProductByTitle;
var updatecart = async (req, res, next) => {
    var cartinf = req.session.cart;
    for (updProd in req.body.updatedProducts) {
        var prod = await findProductByTitle(updProd);
        if (req.body.updatedProducts[updProd] > prod[0].inventory_count) {
            req.session.cart.inventory_available = false;
            break;
        }
        var cartItem = cartinf.items.find(item => item.title === updProd);
        const diffQty = parseInt(req.body.updatedProducts[updProd]) - cartItem.quantity;
        if (diffQty == -cartItem.quantity) {
            cartinf.total_price -= cartItem.quantity * cartItem.price;
            cartinf.items = cartinf.items.filter(itemCart => itemCart.title != updProd);
            if (!cartinf.items.length) cartinf = null;
        }
        else if (diffQty < 0) {
            cartinf.total_price -= (-diffQty) * cartItem.price;
            cartinf.total_price = Math.round(cartinf.total_price * 100) / 100;
            cartItem.quantity = parseInt(req.body.updatedProducts[updProd]);
        }
        /*
        Total Price is increased because quantity is increased
         */
        else {
            cartinf.total_price += (diffQty) * cartItem.price;
            cartinf.total_price = Math.round(cartinf.total_price * 100) / 100;
            cartItem.quantity = parseInt(req.body.updatedProducts[updProd]);
        }
    }
    if (!cartinf) {
        res.json({
            message: 'empty cart'
        })
    }

    else if (req.session.cart.inventory_available) {
        res.json({
            total_price: cartinf.total_price,
            checkout: true,
            cartItems: cartinf.items
        })
    }
    else {
        res.json({
            total_price: cartinf.total_price,
            checkout: false,
            cartItems: cartinf.items
        })

    }

}


var contentcart = (req, res, next) => {
    res.redirect(303, '/cartpage');
}

var cartpage = async (req, res, next) => {
    if (req.session.cart) {
        var checkingAvailabilityProd = true;
        for (item of req.session.cart.items) {
            /*
                if quantity entered by user is more than the
                available inventory set the availability false
            */
            var prod = await findProductByTitle(item.title);
            if (prod[0].inventory_count < item.quantity) {
                checkingAvailabilityProd = req.session.cart.inventory_available = false;
                break;
            }
        }
        res.json({
            cartitems: req.session.cart.items,
            total_price: req.session.cart.total_price,
            checkout: checkingAvailabilityProd
        });
    }

    else {
        /*
        Message is displayed if navigated to cart with
        no products
         */
        res.json({
            message: 'empty cart'
        })
    }
}

var checkoutpage = async (req, res, next) => {
    if (req.session.cart === null) {
        res.json({
            message: 'empty cart'
        })
    } else if (req.session.cart.inventory_available) {
        var cartItemsCheckout = req.session.cart;
        var checkoutItems = Object.assign({}, cartItemsCheckout);
        for (item of checkoutItems.items) {
            try {
                var prod = await findProductByTitle(item.title);
                var updatedProd = await updateProductByTitle(item.title, { inventory_count: prod[0].inventory_count - item.quantity });
            }
            catch (err) {
                // need to store the logs somewhere
                return;
            }
        }
        // set the session to null after getting checkout information
        req.session.cart = null;
        res.json({
            checkoutitems: checkoutItems.items,
            total_price: checkoutItems.total_price
        })
    } else {
        res.json({
            error: 'inventory error'
        })
    }
}

module.exports = {
    updatecart,
    contentcart,
    cartpage,
    checkoutpage
}
