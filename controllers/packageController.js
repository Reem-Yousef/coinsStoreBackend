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
exports.calculate = async (req, res) => {
  try {
    const { coins, amount } = req.body;

    // جلب كل الباقات النشطة
    const packages = await Package.find({ isActive: true }).sort({ order: 1 });

    if (!packages || packages.length === 0) {
      return res.json({ success: false, message: 'لا توجد باقات متاحة' });
    }

    // ✅ حساب السعر من عدد الكوينات
    if (coins) {
      const coinsNum = Number(coins);
      
      // إيجاد الباقة المناسبة
      const pkg = packages.find(p => 
        coinsNum >= p.minCoins && coinsNum <= p.maxCoins
      );

      if (!pkg) {
        return res.json({ 
          success: false, 
          message: 'عدد الكوينات خارج النطاق المتاح' 
        });
      }

      // حساب السعر بدقة
      const price = (coinsNum / 1000) * pkg.pricePerK;
      
      return res.json({
        success: true,
        price: parseFloat(price.toFixed(2)),
        packageTitle: pkg.title,
        pricePerK: pkg.pricePerK
      });
    }

    // ✅ حساب عدد الكوينات من المبلغ
    if (amount) {
      const amountNum = Number(amount);
      
      // جرّب كل باقة واختار اللي تدي أكبر عدد كوينات
      let bestResult = null;
      
      for (const pkg of packages) {
        // حساب عدد الكوينات الممكنة
        const possibleCoins = Math.floor((amountNum / pkg.pricePerK) * 1000);
        
        // تحقق إن الكوينات في نطاق الباقة
        if (possibleCoins >= pkg.minCoins && possibleCoins <= pkg.maxCoins) {
          if (!bestResult || possibleCoins > bestResult.coins) {
            bestResult = {
              coins: possibleCoins,
              packageTitle: pkg.title,
              pricePerK: pkg.pricePerK,
              actualPrice: (possibleCoins / 1000) * pkg.pricePerK
            };
          }
        }
      }

      if (!bestResult) {
        return res.json({ 
          success: false, 
          message: 'المبلغ غير كافٍ لأي باقة' 
        });
      }

      return res.json({
        success: true,
        coins: bestResult.coins,
        packageTitle: bestResult.packageTitle,
        pricePerK: bestResult.pricePerK,
        actualPrice: parseFloat(bestResult.actualPrice.toFixed(2))
      });
    }

    return res.json({ 
      success: false, 
      message: 'يرجى إدخال عدد الكوينات أو المبلغ' 
    });

  } catch (error) {
    console.error('Calculate error:', error);
    res.status(500).json({ success: false, message: 'خطأ في الحساب' });
  }
};