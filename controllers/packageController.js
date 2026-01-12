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

    const packages = await Package.find({ isActive: true }).sort({ minCoins: 1 });

    if (!packages || packages.length === 0) {
      return res.json({ success: false, message: 'لا توجد باقات متاحة' });
    }

    // ✅ حساب السعر من عدد الكوينات
    if (coins !== undefined && coins !== null) {
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

      const price = (coinsNum / 1000) * pkg.pricePerK;
      
      return res.json({
        success: true,
        price: parseFloat(price.toFixed(2)),
        coins: coinsNum,
        packageTitle: pkg.title,
        pricePerK: pkg.pricePerK
      });
    }

    // ✅ حساب الكوينات من المبلغ
    if (amount !== undefined && amount !== null) {
      const amountNum = Number(amount);
      
      // ✅ جرّب كل باقة من الأرخص للأغلى
      let bestResult = null;
      
      for (const pkg of packages) {
        // احسب عدد الكوينات الممكنة
        const exactCoins = (amountNum / pkg.pricePerK) * 1000;
        const flooredCoins = Math.floor(exactCoins);
        
        // ✅ تحقق إن الكوينات في نطاق الباقة
        if (flooredCoins >= pkg.minCoins && flooredCoins <= pkg.maxCoins) {
          // احسب السعر الفعلي
          const actualPrice = (flooredCoins / 1000) * pkg.pricePerK;
          
          // ✅ تأكد إن السعر الفعلي مش أكبر من المبلغ المدخل
          if (actualPrice <= amountNum) {
            // خد أكبر عدد كوينات
            if (!bestResult || flooredCoins > bestResult.coins) {
              bestResult = {
                coins: flooredCoins,
                price: parseFloat(actualPrice.toFixed(2)),
                packageTitle: pkg.title,
                pricePerK: pkg.pricePerK
              };
            }
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
        price: bestResult.price,
        packageTitle: bestResult.packageTitle,
        pricePerK: bestResult.pricePerK
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