var express = require('express'),
    handlebars = require('express-handlebars').create({
        defaultLayout: 'main'
    });
const mongoose = require('mongoose');
mongoose.connect('mongodb://parulraheja98:boldtest12345@ds153566.mlab.com:53566/salon-appointment');

var app = express();
var cors = require('cors');
var credentials = require('./credentials.js');
var product = require('./models/product.js');
var cookieSession = require('cookie-session');
var rateLimit = require('express-rate-limit');
var cartController = require('./controllers/cart.js');
var productController = require('./controllers/product.js');
var createFetchLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min window
    max: 200, // start blocking after 100 requests
    message: "Too many requests , don't try to brute force hahaha"
});
// setting up rate limit for potential brute force attacks
app.use(createFetchLimiter);
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        debug: function() {
            console.log("Current Context");
            console.log("=================");
            console.log(this);
            return null
        },
        section: function(name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3017);
app.use(require('body-parser').urlencoded({
    extended: true
}));
app.use(require('body-parser').json());
app.set('trust proxy', 1)
app.use(
    cookieSession({
        secret: 'keyboard cat',
        name: 'session',
        keys: ['key1', 'key2'],
        cookie: {
            secure: false
        }

    }))

app.use(cors({
    credentials: true,
    origin: 'http://172.18.0.1:3000'
}));

app.use(require('cookie-parser')(credentials.cookieSecret));

app.use(express.static(__dirname + '/public'));

/**
 * Delete all the custom products , except the default products created on start
 automatically for testing
 */

app.get('/deletecustomproducts', productController.deletecustomproducts);
/**
 * Let the user create custom products
 *
 */

app.post('/createcustomproduct', productController.createcustomproduct);
/**
 * Create Sample Products for testing
 *
 */

app.get('/createsampleproducts', productController.createsampleproducts);


/**
 * Get the products with available inventory
 * Parameter check type String
 * If parameter passed is available it will list all products
 * Displays the title , price and inventory of product
 * having inventory
 *
 */
app.get('/fetchproducts/:check', productController.productWithInventory);

/**
 * Update the quantity of product when in the cart
 * Check if updated quantity is greater than the available inventory
 * If quantity is greater than inventory disable checkout button
 * Update the quantity of product along with the price of product.
 */

app.post('/updatecart', cartController.updatecart)

/**
 * Clear the Cart
 * Removes the session data of the cart
 */

app.get('/cart/clear', function(req, res) {
    req.session.cart = null;
    res.render('emptycart');
})

app.get('/sessioninfo', (req, res) => {
    res.send(req.session);
})

/**
 * Displays the cart information
 * Cart total price , added products
 * Checkout button is visible if products are in stock
 */

app.get('/cartpage', cartController.cartpage);


/*
 *  Add the Product with specified id to the cart
 *  Check if the product is already in cart or not
 *  If product is in the cart increase the quantity of product by 1
 *  If product is not in the cart create new cart item of the product
 *  If cart session is empty , create cart session by adding the product with id
 */

app.get('/cart/add/:id', productController.addToCart);

app.get('/clearsession', function(req, res) {
    req.session = null;
    res.json({
        message:"Cart Clear Completed"
    })
})

/**
 * Navigate to the checkout page
 * If cart session is null , Ask the user to add products in the cart
 * Product quantity gets reduced by 1 on reaching the checkout page
 * Cart Session is deleted after successful checkout
 */

app.get('/checkoutpage', cartController.checkoutpage);

app.get('/productpage', productController.createsampleproducts);


app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
});
