const express = require("express");
const {
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
} = require("../controller/productController");
const router = express.Router();
const {authMiddleware, isAdmin} = require("../midddlewares/authMiddleware");
const {uploadPhoto, productImgResize} = require("../midddlewares/uploadImages");

router.get("/product-for-user",authMiddleware, getaProductForUser);
router.put("/rating", authMiddleware, rating);
router.put("/upload/:id", authMiddleware,
     uploadPhoto.array('images', 10),
     productImgResize,
    uploadImages);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/compare", authMiddleware, addToCompare);
router.put("/cart", authMiddleware, addToCart);
router.post("/",authMiddleware, createProduct);
router.get("/:id", getaProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id",authMiddleware, deleteProduct);
router.get("/", getAllProduct);


module.exports = router;