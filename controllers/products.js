/* eslint-disable no-unused-vars */
const fs = require('fs');
const path = require('path');

// const PDFDocument = require('pdfkit');

const Products = require('../models/products')
const AppError = require('../utils/AppError')

const ITEM_PER_PAGE = 10

const productController = {
    getAll: (req,res,next) => {
        // const filteredProduct= Products.find(req.query).then(() => {return res.status(200).json(filteredProduct)})
        const page = +req.query.page || 1
        let totalItem;
        Products.find({}).populate('categoryId')
        // .sort({name: -1, cost:1 ,count:-1,createdAt:-1, updatedAt:-1,categoryId:1 })
        .countDocuments().then(numProducts => {
            totalItem = numProducts
            return Products.find().sort({ "cost": -1 }).skip((page -1) * ITEM_PER_PAGE).limit(ITEM_PER_PAGE)
        }).then(product => {
            res.status(200).json(product)
        })
    },
    createProducts: (req,res,next) => {
        const name = req.body.name
        const cost = req.body.cost
        const count = req.body.count
        const image = req.file.path 
        const discount = req.body.discount
        const status = req.body.status
        const categoryId = req.body.categoryId
        console.log('--',req.file.path)
        // const imageUrl = image.path;
        if (!image) {
            Error();
            const err = new AppError(400, `Not found with  ${image}`);
            return next(err);
        }
        const product = new Products({
            name: name,
            cost:cost,
            count:count,
            image:image,
            categoryId:categoryId,
            discount:discount,
            status:status,
        })
        // let payload = req.body.payload.trim();
        // let search = await Products.find({name: {$regex: new RegExp('^'+payload+'.*','i')}}).exec()
        // search = search.slice(0,10)
        product.save().then(result => {
            res.status(201).json(result)
        }).catch(err => next(err))
    },
    getOne: (req,res,next) => {
        const productId = req.params.id
        console.log(req.query)
        Products.findById(productId).populate('categoryId').then(product => {
            res.status(200).json(product)
        }).catch(err => next(err))
    },
    updateProducts: (req,res,next) => {
        const name = req.body.name
        const cost = req.body.cost
        const count = req.body.count
        const image = req.body.image
        const discount = req.body.discount
        const categoryId = req.body.categoryId
        const productId = req.params.id
        Products.findById(productId).then(product => {
            product.name = name,
            product.cost = cost,
            product.count = count,
            product.image = image,
            product.categoryId = categoryId,
            product.discount = discount
            return product.save();
        }).then(product => {
            res.status(200).json(product)
        }).catch(err => next(err))
    },
    deleteProducts: (req,res,next) => {
        const productsId= req.params.id
        Products.findByIdAndRemove(productsId).then(result => res.status(200).json(`Product deleted successfully`)).catch(err => next(err))
    },
    getInvoice: (req,res,next) => {
        const orderId = req.file.path 
        Products.findById(orderId)
            .then(order => {
                if (!order) {
                return next(new Error('No order found.'));
                }
                const invoiceName = 'invoice-' + orderId + '.pdf';
                const invoicePath = path.join('data', 'invoices', invoiceName);
                // fs.readFile(invoicePath, (err, data) => {
                //   if (err) {
                //     return next(err);
                //   }
                //   res.setHeader('Content-Type', 'application/pdf');
                //   res.setHeader(
                //     'Content-Disposition',
                //     'inline; filename="' + invoiceName + '"'
                //   );
                //   res.send(data);
                // });
                const file = fs.createReadStream(invoicePath);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader(
                'Content-Disposition',
                'inline; filename="' + invoiceName + '"'
                );
                file.pipe(res);
            })
            .catch(err => next(err));
        }
}
module.exports = productController