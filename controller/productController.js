const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify")
const User = require("../models/userModel");
const validateMongoDbId = require("../utils/validatemondodbid");
const {cloudinaryUploadImg} = require("../utils/cloudinary");
const fs = require("fs");

const createProduct = asyncHandler(async (req, res) => {
    console.log("qqqqqq11");
    console.log(req.body);
    try {
        if (req.body.title) {
            let slug = slugify(req.body.title);
            let isSlugUnique = false;
            let counter = 1;

            while (!isSlugUnique) {
                const existingProduct = await Product.findOne({ slug: slug });
                if (existingProduct) {
                    // Slug уже существует, добавляем счетчик к slug
                    slug = `${slug}-${counter}`;
                    counter++;
                } else {
                    // Уникальный slug найден
                    isSlugUnique = true;
                }
            }

            req.body.slug = slug;
        }

        const postedby = req.user._id;
        const newProduct = await Product.create({ ...req.body, user: postedby });
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
});
const updateProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    console.log(id)
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findOneAndUpdate({_id: id}, req.body, {
            new: true,
        });
        console.log(updateProduct)
        res.json(updateProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const rating = asyncHandler(async (req, res) => {
    console.log("222")
    const {_id} = req.user;
    const {star, productId, comment} = req.body;
    try {
        const product = await Product.findById(productId);
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        );
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: {$elemMatch: alreadyRated},
                },
                {
                    $set: {"ratings.$.star": star, "ratings.$.comment": comment},
                },
                {
                    new: true,
                }
            );
        } else {
            const rateProduct = await Product.findByIdAndUpdate(
                productId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id,
                        },
                    },
                },
                {
                    new: true,
                }
            );
        }
        const getallratings = await Product.findById(productId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating);
        let finalproduct = await Product.findByIdAndUpdate(
            productId,
            {
                totalrating: actualRating,
            },
            {new: true}
        );
        res.json(finalproduct);
    } catch (error) {
        throw new Error(error);
    }
});


const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    // validateMongoDbId(id);
    try {
        const deleteProduct = await Product.findOneAndDelete({_id: id});
        res.json(deleteProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getaProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    //validateMongoDbId(id);
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getaProductForUser = asyncHandler(async (req, res) => {
    const id = req.user._id;
    console.log(id)
    //validateMongoDbId(id);
    try {
        const findProducts = await Product.find({ user: id });;
        res.json(findProducts);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllProduct = asyncHandler(async (req, res) => {
    try {
        const queryObj = {...req.query};
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = Product.find(JSON.parse(queryStr));

        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }

        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This Page does not exists");
        }

        const product = await query;
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});


const addToWishlist = asyncHandler(async (req, res) => {
    const {_id} = req.user._id;
    const {productId} = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString() === productId);
        if (alreadyadded) {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: {wishlist: productId},
                },
                {
                    new: true,
                }
            );
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: {wishlist: productId},
                },
                {
                    new: true,
                }
            );
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
});

const addToCompare = asyncHandler(async (req, res) => {
    const {_id} = req.user._id;
    const {productId} = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyadded = user.compare.find((id) => id.toString() === productId);
        if (alreadyadded) {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: {compare: productId},
                },
                {
                    new: true,
                }
            );
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: {compare: productId},
                },
                {
                    new: true,
                }
            );
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
});

const addToCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    try {
        const user = await User.findById(userId);
        const existingCartItem = user.cart.find(
            (item) => item.product.toString() === productId
        );

        if (existingCartItem) {
            user.cart = user.cart.filter(
                (item) => item.product.toString() !== productId
            );

            await user.save();
            res.json(user);
        } else {
            user.cart.push({ product: productId, quantity });
            await user.save();
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
});



const uploadImages = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images")
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const {path} = file;
            const newpath = await uploader(path);
            urls.push(newpath)
            fs.unlinkSync(path)
        }
        const findProduct = await Product.findByIdAndUpdate(id, {
            images: urls.map(file => {
                return file
            }),
        }, {
            new: true
        })
        res.json(findProduct)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishlist,
    rating,
    uploadImages,
    getaProductForUser,
    addToCompare,
    addToCart
};