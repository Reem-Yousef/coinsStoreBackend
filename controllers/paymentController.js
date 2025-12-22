    const PaymentOption = require('../models/PaymentOption');

    exports.getAvailableOptions = async (req, res, next) => {
    try {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();

        const options = await PaymentOption.find({ isActive: true });
        const available = options.filter(opt => {
        if (!opt.availableFrom || !opt.availableTo) return true;
        const [fromH, fromM] = opt.availableFrom.split(':').map(Number);
        const [toH, toM] = opt.availableTo.split(':').map(Number);
        const startMinutes = fromH * 60 + fromM;
        const endMinutes = toH * 60 + toM;
        const nowMinutes = hour * 60 + minute;
        return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
        });
        res.json({ success: true, data: available });
    } catch (err) {
        next(err);
    }
    };

    exports.createPaymentOption = async (req, res, next) => {
    try {
        const newOption = await PaymentOption.create(req.body);
        res.json({ success: true, data: newOption });
    } catch (err) {
        next(err);
    }
    };

    exports.updatePaymentOption = async (req, res, next) => {
    try {
        const updated = await PaymentOption.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: 'PaymentOption not found' });
        res.json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
    };

    exports.deletePaymentOption = async (req, res, next) => {
    try {
        const deleted = await PaymentOption.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: 'PaymentOption not found' });
        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        next(err);
    }
    };
