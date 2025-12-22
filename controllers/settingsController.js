const Settings = require('../models/Settings');

exports.getSettings = async (req, res, next) => {
  try {
    const s = await Settings.findOne() || await Settings.create({});
    res.json({ success: true, data: s });
  } catch (err) {
    next(err);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    let s = await Settings.findOne() || await Settings.create({});
    Object.assign(s, req.body);
    s.updatedAt = Date.now();
    await s.save();
    res.json({ success: true, data: s });
  } catch (err) {
    next(err);
  }
};
