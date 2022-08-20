const path = require('path');
const fs = require('fs')

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
var multer = require('multer');
var morgan = require('morgan')
const helmet = require('helmet');
require('dotenv').config()
 
const Logger = require('./config/logger');
const morganMiddleware = require('./config/morganMiddleware');
const middlewares = require('./middlewares');

const authRoutes = require('./routes/auth.js');
const productsRouter = require('./routes/product.js');
const categoryRouter = require('./routes/category.js');
const operatorRouter = require('./routes/operator.js');
const courierRouter = require('./routes/courier.js');
const accountantRouter = require('./routes/accountant.js');
const searchRouter = require('./routes/search.js');
const authUser = require('./middlewares/userType.js');
const swaggerUi = require('swagger-ui-express')
let swaggerDocument = require('./swagger.json');

const MONGODB_URI = 'mongodb+srv://zafaruralov:1A1s1D1f0@cluster0.rwu0b.mongodb.net/demoBro?retryWrites=true&w=majority';

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

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

app.use(express.json()); 

app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));

app.use(morganMiddleware);
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false,
  store:store
}))
app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

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
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`),
);
  })
  .catch(err => {
    console.log(err)
  });
  