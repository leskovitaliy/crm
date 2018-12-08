const moment = require('moment');
const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

module.exports.overview = async (req, res) => {
  try {
    const allOrders = await Order.find({ user: req.user.id }).sort({ date: 1 });
    const ordersMap = getOrdersMap(allOrders);
    const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [];

    // count orders yesterday
    const yesterdayOrdersNumber = yesterdayOrders.length;
    // count orders
    const totalOrdersNumber = allOrders.length;
    // count all days
    const daysNumber = Object.keys(ordersMap).length;
    // Orders in day
    const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0);
    // Percent for count of orders
    const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);
    // Total profit
    const totalProfit = calculatePrice(allOrders);
    // profit per day
    const profitPerDay = totalProfit / daysNumber;
    // profit yesterday
    const profitYesterday = calculatePrice(yesterdayOrders);
    // percent profit
    const profitPercent = (((profitYesterday / profitPerDay) - 1) * 100).toFixed(2);
    // compare profit
    const compareProfit = (profitYesterday - profitPerDay).toFixed(2);
    // compare count orders
    const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2);

    res.status(200).json({
      profit: {
        percent: Math.abs(+profitPercent),
        compare: Math.abs(+compareProfit),
        yesterday: +profitYesterday,
        isHigher: +profitPercent > 0
      },
      orders: {
        percent: Math.abs(+ordersPercent),
        compare: Math.abs(+compareNumber),
        yesterday: +yesterdayOrdersNumber,
        isHigher: +ordersPercent > 0
      }
    })

  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.analytics = async (req, res) => {
  try {
    const allOrders = await Order.find({ user: req.user.id }).sort({ date: 1});
    const ordersMap = getOrdersMap(allOrders);

    const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2);

    const chart = Object.keys(ordersMap).map(date => {
      const profit = calculatePrice(ordersMap[date]);
      const order = ordersMap[date].length;

      return { label, profit, order };
    });

    res.status(200).json({ average, chart });

  } catch (e) {
    errorHandler(res, e);
  }
};

function getOrdersMap(orders = []) {
  const daysOrders = {};

  orders.forEach(order => {
    const date = moment(order.date).format('DD.MM.YYYY');

    if (date === moment().format('DD.MM.YYYY')) {
      return;
    }

    if (!daysOrders[date]) {
      daysOrders[date] = [];
    }

    daysOrders[date].push(order);
  });

  return daysOrders;
}

function calculatePrice(orders = []) {
  return orders.reduce((total, order) => {
    const orderPrice = order.list.reduce((orderTotal, item) => {
      return orderTotal += item.cost * item.quantity;
    }, 0);

    return total += orderPrice;
  }, 0);
}