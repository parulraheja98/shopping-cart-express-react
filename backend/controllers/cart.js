var product = require('../models/product.js');

var updatecart = (req, res, next) => {
    var testCheck = false;
    var counter = 0;
    var testInvt = 0;
    var cartinf = req.session.cart;
    var ar = [];
    cartinf.items.forEach(function(cartitem, count) {

        var difference = parseInt(req.body.qtyOfProduct[cartitem.title]) - cartitem.quantity;
        quant = cartitem.quantity;
        var cartstoreitem = {
            title: cartitem.title,
            quantity: quant
        }
        ar.push(cartstoreitem);
        cartitem.quantity = parseInt(req.body.qtyOfProduct[cartitem.title]);
        product.find({
            title: cartitem.title
        }, function(err, r) {
            return r
        }).then(function(r) {
            if (req.body[cartitem.title] > r[0].inventory_count) {
                req.session.cart.inventory_available = false;
                testInvt++;
            }

            /**
             * If quantity entered for the product is 0 , product is removed from cart
             */
            if (req.body[cartitem.title] == 0) {
                var updQuantity;
                for (var i = 0; i < ar.length; i++) {
                    if (cartitem.title == ar[i].title)
                        updQuantity = ar[i].quantity;

                }
                cartinf.total_price -= updQuantity * cartitem.price;
                cartinf.items.splice(count - counter, 1);
                counter++;
                testCheck = true;


            }
            /*
            Total Price is decreased because quantity is decreased
             */
            else if (difference < 0) {
                cartinf.total_price -= (-difference) * cartitem.price;
                cartinf.total_price = Math.round(cartinf.total_price * 100) / 100;
            }
            /*
            Total Price is increased because quantity is increased
             */
            else if (difference > 0) {
                cartinf.total_price += (difference) * cartitem.price;
                cartinf.total_price = Math.round(cartinf.total_price * 100) / 100;

            }
            /*
            If cart has no items ask the user to add items
             */

            if (cartinf.items.length == 0)
                res.json({
                    message: 'empty cart'
                })

            else {
                if ((count === cartinf.items.length - 1 && !testCheck) || (testCheck && count === cartinf.items.length - 1 + counter)) {
                    if (testInvt === 0)
                        req.session.cart.inventory_available = true;
                    contentcart(req, res, next);

                }


            }
        })
    })



}


var contentcart = (req, res, next) => {
    res.redirect(303, '/cartpage');
}

var navigateCart = (req, res, next, checkingavailability) => {
    res.json({
        cartitems: req.session.cart.items,
        total_price: req.session.cart.total_price,
        checkout: checkingavailability
    });
}

var cartpage = (req, res, next) => {
    if (req.session.cart != undefined) {
        var checkingavailability = true;
        var cart_items = req.session.cart.items;
        cart_items.forEach(function(item, i) {
            product.find({
                title: item.title
            }, function(err, prod) {
                if (prod[0].inventory_count < item.quantity) {
                    /*
                    if quantity entered by user is more than the
                    available inventory set the checkavailability
                    false
                     */
                    checkingavailability = false;
                    req.session.cart.inventory_available = false;
                    navigateCart(req, res, next, checkingavailability);
                }

                if (cart_items.length - 1 == i && checkingavailability)
                    navigateCart(req, res, next, checkingavailability);

            })

        })

    } else {
        /*
        Message is displayed if navigated to cart with
        no products
         */
        console.log('no products in the cart ');
        res.json({
            message: 'empty cart'
        })
    }
}

var checkoutpage = (req, res, next) => {
    if (req.session.cart == null) {
        res.json({
            message: 'empty cart'
        })
    } else if (req.session.cart.inventory_available) {
        var cart_items_checkout = req.session.cart;
        var checkout_items = Object.assign({}, cart_items_checkout);
        checkout_items.items.forEach(function(d) {
            product.find({
                title: d.title
            }, function(err, re) {
                // update the inventory of the product
                product.update({
                    title: d.title
                }, {
                    $set: {
                        inventory_count: re[0].inventory_count - d.quantity
                    }
                }, function(err, checking) {})
            })
        })
        // set the session to null after getting checkout information
        req.session.cart = null;
        //res.render('checkout', {checkoutitem: checkout_items.items, total_price: checkout_items.total_price});
        res.json({
            checkoutitems: checkout_items.items,
            total_price: checkout_items.total_price
        })
    } else {
        console.log('third stage');
        res.json({
            message: 'inventory error '
        })
    }




}



module.exports = {
    updatecart,
    contentcart,
    navigateCart,
    cartpage,
    checkoutpage
}