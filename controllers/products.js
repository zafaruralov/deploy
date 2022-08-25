/* eslint-disable no-unused-vars */
const fs = require('fs');
const path = require('path');

// const PDFDocument = require('pdfkit');
const { validationResult } = require('express-validator');
const Products = require('../models/products')
const AppError = require('../utils/AppError')

const ITEM_PER_PAGE = 10

const productController = {
    getAll: (req,res,next) => {
        const page = +req.query.page || 1
        let totalItem;
        Products.find({}).populate('categoryId')
        .countDocuments().then(numProducts => {
            totalItem = numProducts
            return Products.find().sort({ "cost": -1 }).skip((page -1) * ITEM_PER_PAGE).limit(ITEM_PER_PAGE)
        }).then(product => {
            res.status(200).json(product)
        })
    },
    createProducts: (req,res,next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const error = new Error('Validation failed, entered data is incorrect.');
          error.statusCode = 422;
          throw error;
        }
        if (!req.file) {
          const error = new Error('No image provided.');
          error.statusCode = 422;
          throw error;
        }
        const name = req.body.name
        const cost = req.body.cost
        const count = req.body.count
        const imageUrl = req.file.path.replace("\\" ,"/");
        const discount = req.body.discount
        const status = req.body.status
        const categoryId = req.body.categoryId
        const product = new Products({
            name: name,
            cost:cost,
            count:count,
            imageUrl:imageUrl,
            categoryId:categoryId,
            discount:discount,
            status:status,
        })
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
        const imageUrl = req.file.path.replace("\\","/");
        const discount = req.body.discount
        const categoryId = req.body.categoryId
        const productId = req.params.id
        Products.findById(productId).then(product => {
            product.name = name,
            product.cost = cost,
            product.count = count,
            product.imageUrl = imageUrl,
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
}
module.exports = productController