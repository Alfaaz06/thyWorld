const Post = require("../models/Post");
const User = require("../models/User");
const { sendEmail } = require("../middlewares/sendEmail")
const crypto = require('crypto');
const cloudinary = require('cloudinary');


exports.register = async(req, res) => {
    try {
        const { name, email, password, avatar } = req.body;

        let user = await User.findOne({ email });

        if (user) return res.status(400).json({
            success: false,
            message: `A user with this email already exists`
        })

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "thyWorldRegister"
        })

        user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        })

        const token = await user.genrateToken();

        const options = { expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), httpOnly: true }

        res.status(201).cookie("token", token, options).json({
            success: true,
            user,
            token
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password").populate("posts followers following");

        if (!user) {
            res.status(400).json({ success: false, message: `Invalid Email Id or Password` })
        }

        const isMatch = await user.matchPassword(password)

        if (!isMatch) {
            res.status(400).json({
                success: false,
                message: "Invalid Email Id or Password"
            })
        }

        const token = await user.genrateToken();

        const options = { expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), httpOnly: true }

        res.status(200).cookie("token", token, options).json({
            success: true,
            user,
            token
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.logout = async(req, res) => {
    try {
        res.status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: true }).json({
            success: true,
            message: "Logged out"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



exports.followUnfollowUser = async(req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);
        if (!userToFollow) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        if (loggedInUser.following.includes(userToFollow._id)) {

            const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);
            const indexfollowers = userToFollow.followers.indexOf(loggedInUser._id);

            loggedInUser.following.splice(indexfollowing, 1);
            userToFollow.followers.splice(indexfollowers, 1);

            await loggedInUser.save();
            await userToFollow.save();

            res.status(200).json({
                success: true,
                message: "User Unfollowed"
            })

        } else {
            loggedInUser.following.push(userToFollow._id);
            userToFollow.followers.push(loggedInUser._id);

            await loggedInUser.save();
            await userToFollow.save();

            res.status(200).json({
                success: true,
                message: "User followed"
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updatePassword = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select("+password");
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please enter the old and new Password"
            })
        }

        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Old Password"
            })
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: false,
            message: "Password Updated Successfully"
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { name, email, avatar } = req.body;
        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }
        if (avatar) {

            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                folder: "thyWorldRegister"
            })
            user.avatar.public_id = myCloud.public_id;
            user.avatar.url = myCloud.secure_url;
        }
        await user.save();
        res.status(200).json({
            success: true,
            message: "User Updated Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.deleteMyProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const posts = user.posts;
        const followers = user.followers;
        const following = user.following;
        const userId = user._id;

        //removing avatar from cloudinary
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);


        await user.remove();
        //logging out user after deleting profile
        res.status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
            //deleteing the post of user
        for (let index = 0; index < posts.length; index++) {
            const post = await Post.findById(posts[index]);
            await cloudinary.v2.uploader.destroy(post.image.public_id);
            await post.remove();
        }
        //delete user from followers list of other users
        for (let index = 0; index < followers.length; index++) {
            const follower = await User.findById(followers[index]);
            const i = followers.following.indexOf(userId);
            follower.following.splice(index, 1);
            await follower.save();
        }
        //delete user from following list of other users
        for (let index = 0; index < following.length; index++) {
            const follows = await User.findById(following[index]);
            const i = follows.followers.indexOf(userId);
            follows.followers.splice(i, 1);
            await follows.save();
        }

        //removing all comments of the user
        const allPost = await Post.find();
        for (let index = 0; index < allPost.length; index++) {
            const post = await Post.findById(allPost[index]._id);
            for (let j = 0; j < post.comments.length; j++) {
                if (post.comments[j].user.toString() === userId.toString()) {
                    post.comments.splice(j, 1);
                }
            }
            await post.save();
        }

        //removing all likes of the user
        for (let index = 0; index < allPost.length; index++) {
            const post = await Post.findById(allPost[index]._id);
            for (let j = 0; j < post.likes.length; j++) {
                if (post.likes[j].user.toString() === userId.toString()) {
                    post.likes.splice(j, 1);
                }
            }
            await post.save();
        }

        res.status(200).json({
            success: true,
            message: "Profile Deleted"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.myProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("posts followers following");
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getUserProfile = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("posts followers following");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find({ name: { $regex: req.query.name, $options: 'i' } });
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.forgotPassword = async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" })
        const resetPasswordToken = user.getResetPasswordToken();
        await user.save();
        const resetUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetPasswordToken}`;
        const message = `Reset Your Password by clicking on the link below : \n\n ${resetUrl}`
        try {
            await sendEmail({ email: user.email, subject: "Reset Password", message });
            res.status(200).json({ success: true, message: `Email sent to ${user.email}` })
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.status(500).json({ success: false, message: error.message })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.resetPassword = async(req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid or has epired"
            })
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({ success: true, message: "Password Updated" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.getMyPosts = async(req, res) => {
    try {
        const users = await User.findById(req.user._id);

        const posts = [];

        for (let index = 0; index < users.posts.length; index++) {
            const post = await Post.findById(users.posts[index]).populate('likes comments.user owner');
            posts.push(post);
        }

        res.status(200).json({
            success: true,
            posts

        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getUserPosts = async(req, res) => {
    try {
        const users = await User.findById(req.params.id);

        const posts = [];

        for (let index = 0; index < users.posts.length; index++) {
            const post = await Post.findById(users.posts[index]).populate('likes comments.user owner');
            posts.push(post);
        }

        res.status(200).json({
            success: true,
            posts

        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}