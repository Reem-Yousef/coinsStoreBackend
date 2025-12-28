const Package = require('../models/Package');

// GET /api/packages - للمستخدمين العاديين (بدون أسعار)
exports.getAll = async (req, res, next) => {
  try {
    const packages = await Package.find({ isActive: true })
      .sort({ order: 1 })
      .select('title description minCoins maxCoins order'); // ✅ بدون pricePerK
    
    res.json({ success: true, data: packages });
  } catch (err) {
    next(err);
  }
};

// GET /api/packages/admin/all - للأدمن فقط (بكل التفاصيل)
exports.getAllAdmin = async (req, res, next) => {
  try {
    const packages = await Package.find().sort({ order: 1 });
    res.json({ success: true, data: packages });
  } catch (err) {
    next(err);
  }
};

// POST /api/packages - إنشاء باكدج جديد
exports.create = async (req, res, next) => {
  try {
    const pkg = await Package.create(req.body);
    res.json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
};

// PUT /api/packages/:id - تعديل باكدج
exports.update = async (req, res, next) => {
  try {
    const updated = await Package.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: 'Package not found' 
      });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/packages/:id - حذف باكدج
exports.remove = async (req, res, next) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Package deleted' });
  } catch (err) {
    next(err);
  }
};

// PUT /api/packages/bulk - تعديل عدة باكدجات
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

// POST /api/packages/calculate - حساب السعر (آمن)
exports.calculate = async (req, res, next) => {
  try {
    const { coins, amount } = req.body;

    // التحقق من المدخلات
    if (!coins && !amount) {
      return res.status(400).json({ 
        success: false, 
        error: "coins or amount is required" 
      });
    }

    const packages = await Package.find({ isActive: true });

    // الحساب بناءً على الكوينات
    if (coins) {
      const tier = packages.find(
        p => coins >= p.minCoins && coins <= p.maxCoins
      );

      if (!tier) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid coins range" 
        });
      }

      const price = (coins / 1000) * tier.pricePerK;
      return res.json({ 
        success: true, 
        coins, 
        price: Number(price.toFixed(2)) 
      });
    }

    // الحساب بناءً على المبلغ
    if (amount) {
      const sortedPackages = packages.sort((a, b) => a.pricePerK - b.pricePerK);
      
      const tier = sortedPackages.find(p => {
        const minPrice = (p.minCoins / 1000) * p.pricePerK;
        return amount >= minPrice;
      });

      if (!tier) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid amount" 
        });
      }

      const coinsCalculated = Math.floor((amount / tier.pricePerK) * 1000);
      return res.json({ 
        success: true, 
        amount, 
        coins: coinsCalculated 
      });
    }

  } catch (err) {
    console.error('Calculate error:', err);
    res.status(500).json({ 
      success: false, 
      error: "Server error" 
    });
  }
};