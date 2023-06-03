const express = require("express");
const {
    productCategory,
    updateProductCategory,
    deleteProductCategory,
    getCategory,
    getAllCategory,
} = require("../controller/productCategoryController");
const router = express.Router();
const {authMiddleware, isAdmin} = require("../midddlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, productCategory);
router.put("/:id", authMiddleware, isAdmin, updateProductCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteProductCategory);
router.get("/:id", getCategory);
router.get("/", getAllCategory);


module.exports = router;