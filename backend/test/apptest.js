const assert = require('chai').assert;
const app = 'http://localhost:3017';
var chai = require('chai')
    , chaiHttp = require('chai-http');
chai.use(chaiHttp);
const mongoose = require('mongoose');
mongoose.connect('mongodb://praheja:boldtest12345@ds163764.mlab.com:63764/shoppingcart');
var product = require('../models/product.js');

/**
 * Invalid id of the product passed in cart/add route
 *
 */

describe('Add Product with invalid Id  ', function() {
    this.timeout(5000);
    it('Should give an error message that we assert equal', function(done) {
        product.find({})
        .then((res) => {
    chai.request(app)
        .get('/cart/add/5cb0ad2f1d25b397999af4f0')
        .end((err,data) => {
            assert(data.body.completed);
            done();
        })

    
});

});
});

/**
 *  This is sample test written to test our product model
 *  - Create Product
 *  - Delete Product
 *
 */


describe( 'Create and delete product models', function(  ){
    before(function(done) {
        console.log("just a test");
        done();
    })
    it( 'Should allow models to be saved and then deleted ', function(){

        var parul_test = new product({ title: 'parul-testing-check' , price : 20 , inventory_count:  10});
        parul_test.save().then(function() {
            product.remove({title: "parul-testing-check"}, function (err, r) {
                if (err == null) console.log("Product Found and Deleted");

            });
        });
    });
});

describe( 'Create , update product model and add to cart', function(){
    it( 'Should return status code of 200 ', function(done) {
        this.timeout(5000);
        var parul_test = new product({title: 'parul-new-test', price: 20, inventory_count: 10});
        parul_test.save().then(function () {
            product.update({title: "parul-new-test"}, {$set: {price: 90}}, function (err, re) {
                product.find({title:'parul-new-test'},function(err,r) { return r }).then(function(ch) {
                    chai.request(app)
                        .get('/cart/add/'+ch[0]._id)
                        .end(function (err, data) {
                            assert.equal(data.status, 200, "the status code should be 200")
                            done();

                        })
                })

            })

        },done);
    })
});

/**
 *  Test for checking if product with no inventory display on fetchproducts page
 *  Create a test product with inventory to be 0
 *  Check if it is displayed
 *  Delete the test product
 */

describe( 'Create Product without inventory', function(){
    it( 'Product without inventory shouldnot be displayed', function(done) {
        this.timeout(5000);
        var parul_test = new product({title: 'parul-new-testing1', price: 20, inventory_count: 0});
        parul_test.save().then(function () {
                product.find({title:'parul-new-testing1'},function(err,r) { return r }).then(function(ch) {
                    console.log(ch[0]._id);
                    chai.request(app)
                        .get('/fetchproducts/available')
                        .end(function (err, data) {
                            assert.equal(data.status, 200, "the status code should be 404");
                            assert.equal(data.text.indexOf('parul-new-testing1'),-1,"Product is not in stock");
                        product.remove({title: "parul-new-testing1"}, function (err, r) {
                            done();
                        })
                    })
            },done)

        });
    })
});

describe('Test Sample Products', function() {
    this.timeout(5000);
    it('Test Sample Products', function(done) {

    chai.request(app)
        .get('/createsampleproducts')
        .end((err,data) => {
            assert(data.body.productsForDisplay);
            done();
        })

    

});
});