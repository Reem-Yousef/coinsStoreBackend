const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res, next) => {
  try {
    const { userAmount, coins, paymentType, paymentValue, contacts } = req.body;
    const newTrans = await Transaction.create({ userAmount, coins, paymentType, paymentValue, contacts });
    res.json({ success: true, data: newTrans });
  } catch (err) {
    next(err);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json({ success: true, data: transactions });
  } catch (err) {
    next(err);
  }
};

exports.updateTransactionStatus = async (req, res, next) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
