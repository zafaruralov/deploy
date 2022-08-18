/* eslint-disable no-unused-vars */
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
// isAuthenticated

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: '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'
        }
    })
)
const signJwtToken = (email, password, userType) => {
    const token = jwt.sign(
        { email, password, userType },
        'secretword',
        {
            expiresIn: '24h',
        }
    );
    return token;
};

const authController = {
    getAll: (req,res,next) => {
        res.status(200).json('Auth', {
            isAuthenticated: req.session.isLoggedIn
        })
    },
    postLogin: (req,res,next) => {
        // res.setHeader('Set-Cookie', 'loggedIn=true','httpOnly')
        const email = req.body.email;
        const password = req.body.password;
        const userType = req.body.userType;
        User.findOne({email: email}).then(user => {
            if(!user){
                Error()
                const err = new AppError(400, `not Found with this email: ${email}`)
                return next(err)
            }
            const token = signJwtToken(
                user.email,
                user.password,
                user.userType
            );
            bcrypt.compare(password, user.password).then(doMatch => {
                if(doMatch){
                    req.session.isLoggedIn = true
                    req.session.user = user
                    res.status(200).json(token)
                }
                res.status(400).json('not user')
            })
            .catch(err => {
                next(err);
              });
        })
    },
    postLogout: (req,res,next) => {
        req.session.destroy(err => {
            console.log(err)
            res.json('hello')
        })
        .catch(err => {
            next(err);
          });
    },
    postSignup: async(req,res,next) => {
        try {
            const email = req.body.email
            const password = req.body.password
            const userType = req.body.userType
            const hashedPassword = await bcrypt.hash(password, 10);
            const USER = await User.findOne({email: email})
            if(USER){
                return next(
                    new AppError(
                        400,
                        `There is user with this email: ${email}`
                    )
                )
            }
            const user = new User({
                email: email,
                password: hashedPassword,
                userType: userType
            })
            const token = signJwtToken(email, hashedPassword, userType);
            await user.save();
            res.status(200).json({ token });
        } catch (error) {
            next(error)
        }
            // return bcrypt.hash(password, 10).then(hashedPassword => {
            //     const user = new User({
            //         email: email,
            //         password: hashedPassword,
            //         userType: userType
            //     })
            //     return user.save();
            // })
            // .then(result => {
            //     return transporter.sendMail({
            //       to: email,
            //       from: 'shop@node-complete.com',
            //       subject: 'Signup succeeded!',
            //       html: '<h1>You successfully signed up!</h1>'
            //     })
            //   })
    }
}
module.exports = authController