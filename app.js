const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');
const keys = require('./config/keys');
const app = express();

mongoose.connect(keys.mongoURI, { useNewUrlParser: true, createIndexes: true })
    .then(() => console.log('Mongo db connected.'))
    .catch(err => console.log(err));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev')); // for log api in terminal
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.urlencoded({ extended: true })); // parse response
app.use(bodyParser.json());

app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist/client'));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(
          __dirname, 'client', 'dist', 'client', 'index.html'
      )
    )
  });
}

module.exports = app;