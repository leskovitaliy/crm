const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

// get localhost:5000/api/order?offset=2&limit=5
module.exports.getAll = async (req, res) => {
  const query = {
    user: req.user.id
  };

  // Date start
  if (req.query.start) {
    query.date = {
      // date >=
      $gte: req.query.start
    }
  }

  if (req.query.end) {
    if (!query.date) {
      query.date = {};
    }
    // date <=
    query.date['$lte'] = req.query.end;
  }

  if (req.query.order) {
    query.order = parseInt(req.query.order, 10);
  }

  try {
    const orders = await Order
        .find(query)
        .sort({ date: -1})
        .skip(parseInt(req.query.offset, 10))
        .limit(parseInt(req.query.limit, 10));

    res.status(200).json(orders);

  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.create = async (req, res) => {
  try {
    const lastOrder = await Order
        .findOne({user: req.user.id})
        .sort({date: -1});  // get order by last date

    const maxOrder = lastOrder ? lastOrder.order : 0;

    const order = await new Order({
      list: req.body.list,
      user: req.user.id,
      order: maxOrder + 1
    }).save();

    res.status(201).json(order);
  } catch (e) {
    errorHandler(res, e);
  }
};