const Category = require('../models/Category');
const Position = require('../models/Position');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id });
    res.status(200).json(categories);
  } catch (e) {
    errorHandler(e);
  }
};

module.exports.getById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category);
  } catch (e) {
    errorHandler(e);
  }
};

module.exports.remove = async (req, res) => {
  try {
    await Category.remove({ _id: req.params.id });
    await Position.remove({ category: req.params.id });

    res.status(200).json({
      message: 'Category removed'
    })

  } catch (e) {
    errorHandler(e);
  }
};

module.exports.create = (req, res) => {
  try {

  } catch (e) {
    errorHandler(e);
  }
};

module.exports.update = (req, res) => {
  try {

  } catch (e) {
    errorHandler(e);
  }
};