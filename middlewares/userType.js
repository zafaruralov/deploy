const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const auth = {
    checkToken: (req, res, next) => {
        const bearerToken = req.headers.authorization;
        const jwtToken = bearerToken && bearerToken.split(' ')[1]; 
        if (!jwtToken) {
            const error = new AppError(401, 'No token available');
            return next(error);
        }

        let jwtPayload;
        try {
            jwtPayload = jwt.verify(jwtToken, 'secretword');
        } catch (error) {
            const err = new AppError(500, 'jwt token yaroqsiz');
            return next(err);
        }
        req.user = jwtPayload;
        next();
    },
    checkUserType: (userType) => (req, res, next) => {
        const user = req.user;
        console.log('user', user.userType);
        const hasPermission =
            user.userType /* guest */ === userType; /* creator */
        if (!hasPermission) {
            const err = new AppError(
                403,
                'User has no needed permissions to execute this operation'
            );
            return next(err);
        }
        next();
    },
};

module.exports = auth;
