const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const crypto = require("crypto")
const {ObjectId} = require("mongodb");
const {Mongoose} = require("mongoose");
var categorySchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
            unique:true,
            index:true
        },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("PCategory", categorySchema)