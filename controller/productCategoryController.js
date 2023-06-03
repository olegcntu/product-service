const Category = require("../models/productCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validatemondodbid");

const productCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

const updateProductCategory = asyncHandler(async (req, res) => {
    const id = req.params.id
    validateMongoDbId(id)
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {new: true})
        res.json(updatedCategory)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteProductCategory = asyncHandler(async (req, res) => {
    const id = req.params.id
    validateMongoDbId(id)
    try {
        const deletedCategory = await Category.findByIdAndDelete(id)
        res.json(deletedCategory)
    } catch (error) {
        throw new Error(error)
    }
})

const getCategory = asyncHandler(async (req, res) => {
    const id = req.params.id
    validateMongoDbId(id)
    try {
        const getCategory = await Category.findById(id)
        res.json(getCategory)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllCategory = asyncHandler(async (req, res) => {

    try {
        const getCategory = await Category.find()
        res.json(getCategory)
    } catch (error) {
        throw new Error(error)
    }
})
module.exports = {productCategory, updateProductCategory, deleteProductCategory, getCategory, getAllCategory}