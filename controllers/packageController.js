const Package = require('../models/Package');

exports.getAll = async (req, res, next) => {
  try {
    const packages = await Package.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: packages });
  } catch (err) {
    next(err);
  }
};

exports.getAllAdmin = async (req, res, next) => {
  try {
    const packages = await Package.find().sort({ order: 1 });
    res.json({ success: true, data: packages });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const pkg = await Package.create(req.body);
    res.json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Package deleted' });
  } catch (err) {
    next(err);
  }
};

exports.bulkUpdate = async (req, res, next) => {
  try {
    const { packages } = req.body;
    const updatePromises = packages.map(pkg => 
      Package.findByIdAndUpdate(pkg._id, pkg, { new: true })
    );
    await Promise.all(updatePromises);
    res.json({ success: true, message: 'Packages updated' });
  } catch (err) {
    next(err);
  }
};