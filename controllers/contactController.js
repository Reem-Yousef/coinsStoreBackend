const ContactLink = require('../models/ContactLink');

exports.getAll = async (req, res, next) => {
  try {
    const links = await ContactLink.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: links });
  } catch (err) {
    next(err);
  }
};

exports.getAllAdmin = async (req, res, next) => {
  try {
    const links = await ContactLink.find().sort({ order: 1 });
    res.json({ success: true, data: links });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const link = await ContactLink.create(req.body);
    res.json({ success: true, data: link });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await ContactLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Contact link not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await ContactLink.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact link deleted' });
  } catch (err) {
    next(err);
  }
};