/* eslint-disable no-unused-vars */
const path = require('path');
const fs = require('fs')

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
var multer = require('multer');
 
const Logger = require('./config/logger');
const morganMiddleware = require('./config/morganMiddleware');
const middlewares = require('./middlewares');

const authRoutes = require('./routes/auth.js');
const productsRouter = require('./routes/product.js');
const User = require('./models/user');
const categoryRouter = require('./routes/category.js');
const operatorRouter = require('./routes/operator.js');
const courierRouter = require('./routes/courier.js');
const accountantRouter = require('./routes/accountant.js');
const searchRouter = require('./routes/search.js');
const authUser = require('./middlewares/userType.js');
var upload = multer({ dest: 'uploads/' });

const MONGODB_URI =
  'mongodb+srv://zafaruralov:1A1s1D1f0@cluster0.rwu0b.mongodb.net/demoBro?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'session'
})


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('./images', express.static(path.join(__dirname, 'images')));


app.use(morganMiddleware);
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false,
  store:store
}))


app.use(
  '/accountant',
  authUser.checkToken,
  accountantRouter //accountant
);
app.use(
  '/products', 
  authUser.checkToken,
  productsRouter //superAdmin
);
app.use(
  '/operator',
  authUser.checkToken,
  operatorRouter // operator
);
app.use(
  '/courier',
  authUser.checkToken,
  courierRouter // courier
);
app.use(
  '/search',
  authUser.checkToken,
  searchRouter // search
);
app.use(
  authRoutes
);

app.use('/category',  categoryRouter);

app.use((err, req, res, next) => {
    console.log(err);
    Logger.error(err.message);
    res.status(err.statusCode || 500).json({ message: err.message });
});

app.use('*', middlewares.notFound);


mongoose
  .connect(MONGODB_URI)
  .then(result => {
    User.findOne({ userType: 'superAdmin' }).then(user => {
      if (!user) {
        const user = new User({
          email: 'superAdmin@gmail.com',
          password: 'superadmin',
          userType: 'superAdmin'
        });
        user.save();
      }
    });
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`),
);
  })
  .catch(err => {
    console.log(err)
  });