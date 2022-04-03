const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    avatar: {
        public_id: String,
        url: "String"
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: [true, "Email already exists"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false,
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

//Hashing the password
userSchema.pre("save", async function(next) {
    if (this.isModified("password"))
        this.password = await bcrypt.hash(this.password, 10);
    next();
})

//Matching the Password
userSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

//Generating token
userSchema.methods.genrateToken = function() {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
}

//genrating reset password token
userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken
}

module.exports = mongoose.model("User", userSchema);