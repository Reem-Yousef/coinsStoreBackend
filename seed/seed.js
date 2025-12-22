require('dotenv').config();
const connectDB = require('../config/db');
const Package = require('../models/Package');
const ContactLink = require('../models/ContactLink');

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    
    // Clear existing data
    await Package.deleteMany();
    await ContactLink.deleteMany();
    console.log('Cleared existing data');

    // Seed Packages with pricing tiers
    const packages = await Package.insertMany([
      { minCoins: 1, maxCoins: 199, pricePerK: 620, title: 'باقة البداية', order: 1, isActive: true },
      { minCoins: 200, maxCoins: 299, pricePerK: 600, title: 'باقة البرونز', order: 2, isActive: true },
      { minCoins: 300, maxCoins: 500, pricePerK: 575, title: 'باقة الفضة', order: 3, isActive: true },
      { minCoins: 501, maxCoins: 750, pricePerK: 570, title: 'باقة الذهب', order: 4, isActive: true },
      { minCoins: 751, maxCoins: 999, pricePerK: 560, title: 'باقة البلاتين', order: 5, isActive: true },
      { minCoins: 1000, maxCoins: 5999, pricePerK: 540, title: 'باقة الماس', order: 6, isActive: true },
      { minCoins: 6000, maxCoins: 14999, pricePerK: 537.5, title: 'باقة VIP', order: 7, isActive: true },
      { minCoins: 15000, maxCoins: 24999, pricePerK: 535, title: 'باقة VVIP', order: 8, isActive: true },
      { minCoins: 25000, maxCoins: 29998, pricePerK: 533, title: 'باقة النخبة', order: 9, isActive: true },
      { minCoins: 29999, maxCoins: 70000, pricePerK: 530, title: 'باقة الأسطورة', order: 10, isActive: true },
      { minCoins: 70001, maxCoins: 100000, pricePerK: 525, title: 'باقة الملوك', order: 11, isActive: true }
    ]);
    console.log('✅ Seeded packages:', packages.length);

    // Seed Contact Links
    const contacts = await ContactLink.insertMany([
      {
        type: 'whatsapp',
        label: 'واتساب الدعم',
        url: 'https://wa.me/2010XXXXXXX',
        icon: '💬',
        order: 1,
        isActive: true
      },
      {
        type: 'telegram',
        label: 'تليجرام',
        url: 'https://t.me/XXXX',
        icon: '📱',
        order: 2,
        isActive: true
      }
    ]);
    console.log('✅ Seeded contact links:', contacts.length);

    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
})();