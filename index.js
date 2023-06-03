const express = require('express')
const dbConnect = require("./config/dbConnect");
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000;
const productRouter=require('./routes/productRoute')
const brandRoutes=require('./routes/brandRoutes')
const categoryRouter=require('./routes/productCategoryRouter')
const bodyParser = require("body-parser");
const {errorHandler} = require("./midddlewares/errorHandler");
const cookieParser=require("cookie-parser")
const cors = require('cors');
const morgan=require("morgan")
const multer = require("multer");
dbConnect();

app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(cors());

app.use("/api/product",productRouter)
app.use("/api/category",categoryRouter)
app.use("/api/category",categoryRouter)
app.use("/api/brand",brandRoutes)

app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})