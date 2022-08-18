const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        userType: {
            type: String,
            enum: ['user', 'superAdmin', 'courier', 'accountant', 'operator'],
            default: 'user',
        },
    },
    { timestamps: true }
)
module.exports = mongoose.model('User', userSchema)

// UserSchema.methods.generateJWT = function() {
//     var today = new Date();
//     var exp = new Date(today);
//     exp.setDate(today.getDate() + 60);
//
//     return jwt.sign({
//       id: this._id,
//       username: this.username,
//       exp: parseInt(exp.getTime() / 1000),
//     }, secret);
//   };

//   mongoose.model('User', UserSchema);
