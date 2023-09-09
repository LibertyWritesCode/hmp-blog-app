import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    roles: {
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        maxlength: 100
    },
    registeredAt: {
        type: Date,
        default: new Date()
    },
});

module.exports = mongoose.model('User', userSchema);
