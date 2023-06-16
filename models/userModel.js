const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const crypto = require("crypto")
const {ObjectId} = require("mongodb");
const {Mongoose} = require("mongoose");
var userSchema = new mongoose.Schema({
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        mobile: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            default: "user"
        },
        cart: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                default: 1,
            },
        }],
        buyers:[
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                firstname: {
                    type: String,
                    required: true
                },
                lastname: {
                    type: String,
                    required: true
                },
                address: {
                    type: String,
                    required: true
                },
                city: {
                    type: String,
                    required: true
                },
                email: {
                    type: String,
                    required: true,
                    unique: true
                },
                mobile: {
                    type: String,
                    required: true,
                    unique: true
                },
            }
        ],
        address: {
            type: String,
        },
        wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
        compare: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
        refreshToken: {
            type: String,
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
})
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}
userSchema.methods.createPasswordResetToken = async function () {
    const resettoken = crypto.randomBytes(32).toString("hex")
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resettoken)
        .digest('hex')

    this.passwordResetExpires=Date.now()+30*60*1000;
    return resettoken
}
module.exports = mongoose.model("User", userSchema)