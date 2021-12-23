const moment = require("moment");
const express = require("express");
const bcrypt = require("bcryptjs");
// Mongoose
const mongoose = require("mongoose");

const User = require("../Model/User");

exports.foundUserByEmail = async (email) => {
    return User.findOne({ email: email, isDeleted: false });
};
exports.bcryptPassword = async(password)=> {
    return bcrypt.hash(password, 10);
}
exports.findUserByUserName = async (userName) => {
    return await User.findOne({ userName: userName });
}
exports.updateUserCoins = async (findObj, setObj) => {
    return User.updateOne(findObj, { $set: { credits: setObj } });
}
exports.foundUserById = async (_id) => {
    return await User.findOne({ _id: _id });
}

exports.foundUserByToken = async (token) => {
    return await User.findOne({ forgotToken: token });
}

exports.updateToken = async (id, forgotToken) => {
    return User.updateOne({ _id: id }, { resetPasswordToken: forgotToken });
}

exports.updateTime = async (id, expiryTime) => {
    return User.updateOne({ _id: id }, { resetPasswordExpires: expiryTime });
}

exports.updateUser = async (findObj, setObj) => {
    return User.updateOne(findObj, { $set: setObj });
}

exports.updateUserAndToken = async (res, id, password) => {
    let result;
    return await User.updateOne({ _id: id }, { password: password, resetPasswordToken: null }).exec()
        .then(docs => {
            result = docs;
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}
exports.createUser = async (email, password,role = 'user') => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        password: password,
        profileImage: "default.jpg",
        backgroundImage: "default.jpg",
        role: role
    });
    await user.save();
}

exports.createAdmin = async (email, password,role = 'admin') => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        password: password,
        profileImage: "default.jpg",
        backgroundImage: "default.jpg",
        role: role
    });
    await user.save();
}


exports.addUserByAdmin = async (email, userName, fullName, about) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        userName: userName,
        fullName: fullName,
        about: about,
        password: '123456789',
        profileImage: "default.jpg",
        backgroundImage: "default.jpg"
    });
    await user.save();
}

exports.deleteUser = async (id) => {
    let updateInfo = {
        isDeleted: true,
        deletedAt: moment()
    }
    await User.updateOne({ _id: id }, { $set: updateInfo }).exec();
}


exports.findAllUsers = async () => {

    let listOfUsers = [];
    listOfUsers = await User.find({ isDeleted: false, role: 'user' }, {
        fullName: 1,
        userName: 1,
        email: 1,
        credits: 1,
        matches: 1,
        wins: 1,
        losses: 1,
        winPercentage: 1,
        about: 1,
        _id: 0
    });
    return listOfUsers;
}

exports.showMyProfile = async (email) => {
    let data = await User.findOne({ isDeleted: false, role: 'user' }, {
        userName: 1,
        credits: 1,
        matches: 1,
        wins: 1,
        losses: 1,
        winPercentage: 1,
        _id: 0,
    })
    return data;
}

exports.profile = async (id) => {
    let data = await User.findOne({ _id: id }, {
        _id: 1,
        userName: 1,
        credits: 1,
        matches: 1,
        wins: 1,
        losses: 1,
        winPercentage: 1,
    })
    return data;
}

exports.updatingUser = async (user_, request, res) => {

    let result = "";

    const updateUserInfo = {
        fullName: request.fullName || user_.fullName,
        userName: request.userName || user_.userName,
        email: request.email || user_.email,
        password: request.password || user_.password,
        profileImage: request.profileImage || user_.profileImage,
        backgroundImage: request.backgroundImage || user_.backgroundImage,
        credits: request.credits || user_.credits,
        matches: request.matches || user_.matches,
        wins: request.wins || user_.wins,
        losses: request.losses || user_.losses,
        winPercentage: request.winPercentage || user_.winPercentage,
    };

    await User.updateOne({ _id: request._id }, { $set: updateUserInfo })
        .exec()
        .then(docs => {
            result = docs;
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    return result;
}

exports.addGamerTag = async (user, GamerTags, res) => {
    let result = "";
    await User.updateOne({ _id: user._id }, { $set: { gamerTag: GamerTags } })
        .exec()
        .then(docs => {
            result = docs;
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

    return result;
}




exports.addFriend = async (user, friend, res) => {
    return User.updateOne(user, { $push: { friends: { friend } } });
}
exports.findFriend = async (userName, user) => {
    return await User.findOne({ _id: user._id }, { friends: { $elemMatch: { userName: userName } } });
};
