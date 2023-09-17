import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: validator.isEmail,
        unique: true
    },
    roles: {
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
   // passwordConfirm: {
     //   type: String,
       // required: true
    // },
    bio: {
        type: String,
        maxlength: 100
    },
    registeredAt: {
        type: Date,
        default: new Date()
    },
});

  //Compare password with hashed password
 // userSchema.methods.correctPassword = async function(candidatePassword, userPassword): Promise<any> {
   // return await bcrypt.compare(candidatePassword, userPassword)
  // }

export const UserModel = mongoose.model('User', userSchema);
