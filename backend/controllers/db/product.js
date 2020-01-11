const product = require('../../models/product.js');

async function findProductByTitle(title) {
    return new Promise((resolve, reject) => {
        product.find({ title }, (err, prod) => {
            if (err) reject(err);
            else {
                resolve(prod)
            }
        })
    })
}

async function fetchProducts() {
    return new Promise((resolve, reject) => {
        product.find({}, (err, prod) => {
            if (err) reject(err);
            else resolve(prod);
        });
    });
}

async function updateProductByTitle(title, data) {
    return new Promise((resolve, reject) => {
        product.update({
            title
        }, {
            $set: data
        }, function(err, updProd) {
            if(err) {
                reject(err);
            }
            else {
                resolve(updProd);
            }
        })
    });
}

module.exports = {
    findProductByTitle,
    fetchProducts,
    updateProductByTitle
}