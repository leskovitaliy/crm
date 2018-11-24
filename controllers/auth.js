const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');


module.exports.login = async (req, res) => {
  const foundUser = await User.findOne({ email: req.body.email });

  if (foundUser) {
    // check password
    const isCheckPassword = bcrypt.compareSync(req.body.password, foundUser.password);

    if (isCheckPassword) {
      // generate token
      const token = jwt.sign({
        email: foundUser.email,
        userId: foundUser._id
      }, keys.jwt, { expiresIn: 60 * 60 });

      res.status(200).json({
        token: `Bearer ${token}`
      })

    } else {
      // Passwords do not match
      res.status(401).json({
        message: 'Wrong password.'
      })
    }
  } else {
    res.status(404).json({
      message: `User with email: ${req.body.email} not found.`
    });
  }
};

module.exports.register = async (req, res) => {
  const foundUser = await User.findOne({ email: req.body.email });

  if (foundUser) {
    // User exist return err
    res.status(409).json({
      message: 'This email exist'
    });
  } else {
    // create new user
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt)
    });

    try {
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      console.log('err: ', err);
      errorHandler(res, err);
    }
  }
};