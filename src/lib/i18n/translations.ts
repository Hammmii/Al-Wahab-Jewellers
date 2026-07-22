export type Lang = 'en' | 'ur'

/**
 * UI string dictionary. English + Urdu.
 * Keep keys flat and descriptive. Add strings here as pages adopt the toggle.
 */
export const translations = {
  // Brand / nav
  'nav.home': { en: 'Home', ur: 'صفحہ اول' },
  'nav.collections': { en: 'Collections', ur: 'مجموعہ' },
  'nav.customDesign': { en: 'Create Your Design', ur: 'اپنا ڈیزائن بنوائیں' },
  'nav.tryOn': { en: 'Preview Studio', ur: 'پریویو اسٹوڈیو' },
  'nav.about': { en: 'About', ur: 'ہمارے بارے میں' },
  'nav.contact': { en: 'Contact', ur: 'رابطہ' },
  'nav.cart': { en: 'Cart', ur: 'کارٹ' },
  'nav.wishlist': { en: 'Wishlist', ur: 'پسندیدہ' },
  'nav.search': { en: 'Search', ur: 'تلاش' },

  // Hero / common actions
  'cta.explore': { en: 'Explore the Collection', ur: 'مجموعہ دیکھیں' },
  'cta.bespoke': { en: 'Bespoke Design', ur: 'مخصوص ڈیزائن' },
  'cta.startCustom': { en: 'Start a Custom Design', ur: 'مخصوص ڈیزائن شروع کریں' },
  'cta.continueShopping': { en: 'Continue Shopping', ur: 'خریداری جاری رکھیں' },
  'cta.browseCollection': { en: 'Browse the Collection', ur: 'مجموعہ دیکھیں' },
  'cta.bookVisit': { en: 'Book a Visit', ur: 'ملاقات بک کریں' },
  'cta.getInTouch': { en: 'Get Directions and Contact', ur: 'راستہ اور رابطہ' },
  'cta.inquire': { en: 'Inquire Now', ur: 'ابھی پوچھیں' },
  'cta.send': { en: 'Send Message', ur: 'پیغام بھیجیں' },
  'cta.sending': { en: 'Sending…', ur: 'بھیجا جا رہا ہے…' },
  'cta.backHome': { en: 'Back to home', ur: 'صفحہ اول پر واپس' },

  // Trust
  'trust.location': { en: 'Multan Sarafa Bazar, Shop 2', ur: 'ملتان سرافہ بازار، دکان 2' },
  'trust.hallmarked': { en: 'Pure Gold', ur: 'خالص سونا' },
  'trust.payment': { en: 'COD and Bank Transfer', ur: 'کیش آن ڈیلیوری و بینک' },

  // Gold rate
  'gold.title': { en: "Today's Gold Rate", ur: 'آج کا سونے کا ریٹ' },
  'gold.perTola': { en: 'Gold / Tola', ur: 'سونا / تولہ' },
  'gold.unavailable': { en: 'Rate unavailable', ur: 'ریٹ دستیاب نہیں' },
  'gold.lastUpdated': { en: 'Last updated', ur: 'آخری اپڈیٹ' },
  'gold.loading': { en: 'Loading…', ur: 'لوڈ ہو رہا ہے…' },

  // Product
  'product.from': { en: 'From', ur: 'شروع' },
  'product.addToCart': { en: 'Add', ur: 'شامل کریں' },
  'product.save': { en: 'Save', ur: 'محفوظ کریں' },
  'product.saved': { en: 'Saved', ur: 'محفوظ شدہ' },
  'product.enquire': { en: 'Enquire', ur: 'پوچھیں' },
  'product.purity': { en: 'Purity', ur: 'پاکیزگی' },
  'product.weight': { en: 'Weight', ur: 'وزن' },
  'product.size': { en: 'Size', ur: 'سائز' },
  'product.stock': { en: 'Stock', ur: 'مقدار' },
  'product.quantity': { en: 'Quantity', ur: 'مقدار' },
  'product.madeToOrder': { en: 'Made to order', ur: 'آرڈر پر تیار' },
  'product.available': { en: 'available', ur: 'دستیاب' },
  'product.notFound': { en: 'Piece not found', ur: 'شے نہیں ملی' },
  'product.notFoundDesc': { en: 'This piece is not available. It may have moved or sold.', ur: 'یہ شے دستیاب نہیں۔' },
  'product.backToCollection': { en: 'Back to Collection', ur: 'مجموعے پر واپس' },
  'product.collection': { en: 'Collection', ur: 'مجموعہ' },

  // Collections
  'collections.title': { en: 'Our Jewellery', ur: 'ہمارا زیور' },
  'collections.subtitle': { en: 'Browse our gold. Each piece is hallmarked, hand finished, and ready to be inherited.', ur: 'ہمارا سونا دیکھیں۔ ہر شے خالص اور ہاتھ سے بنی ہے۔' },
  'collections.all': { en: 'All', ur: 'تمام' },
  'collections.empty': { en: 'No pieces here yet', ur: 'ابھی کوئی شے نہیں' },
  'collections.emptyDesc': { en: "We are adding to this collection soon. Visit our showroom, or commission a custom piece.", ur: 'ہم جلد یہاں اشیاء شامل کریں گے۔' },

  // Cart / checkout
  'cart.title': { en: 'Shopping Cart', ur: 'خریداری کی ٹوکری' },
  'cart.empty': { en: 'Your cart is empty', ur: 'آپ کی ٹوکری خالی ہے' },
  'cart.emptyDesc': { en: 'Explore our collection and add the pieces you love.', ur: 'مجموعہ دیکھیں اور پسند کی اشیاء شامل کریں۔' },
  'cart.subtotal': { en: 'Subtotal', ur: 'کل' },
  'cart.total': { en: 'Total', ur: 'کل' },
  'cart.summary': { en: 'Order Summary', ur: 'آرڈر کا خلاصہ' },
  'cart.checkout': { en: 'Proceed to Checkout', ur: 'چیک آؤٹ' },
  'cart.clear': { en: 'Clear cart', ur: 'ٹوکری خالی کریں' },
  'cart.remove': { en: 'Remove', ur: 'ہٹائیں' },
  'cart.selection': { en: 'Your selection', ur: 'آپ کی انتخاب' },
  'cart.items': { en: 'items', ur: 'اشیاء' },

  'order.title': { en: 'Checkout', ur: 'چیک آؤٹ' },
  'order.yourOrder': { en: 'Your order', ur: 'آپ کا آرڈر' },
  'order.placeOrder': { en: 'Place Order', ur: 'آرڈر دیں' },
  'order.placing': { en: 'Placing order…', ur: 'آرڈر دیا جا رہا ہے…' },
  'order.contact': { en: 'Contact', ur: 'رابطہ' },
  'order.address': { en: 'Delivery address', ur: 'ڈیلیوری کا پتہ' },
  'order.payment': { en: 'Payment method', ur: 'ادائیگی کا طریقہ' },
  'order.cod': { en: 'Cash on Delivery', ur: 'کیش آن ڈیلیوری' },
  'order.codDesc': { en: 'Pay when it arrives', ur: 'مال پہنچنے پر ادائیگی' },
  'order.bank': { en: 'Bank Transfer', ur: 'بینک ٹرانسفر' },
  'order.bankDesc': { en: "We'll send details", ur: 'ہم تفصیلات بھیجیں گے' },
  'order.notes': { en: 'Order notes (optional)', ur: 'نوٹس (اختیاری)' },
  'order.name': { en: 'Full name', ur: 'پورا نام' },
  'order.phone': { en: 'Phone', ur: 'فون' },
  'order.email': { en: 'Email (optional)', ur: 'ای میل (اختیاری)' },
  'order.city': { en: 'City', ur: 'شہر' },
  'order.province': { en: 'Province', ur: 'صوبہ' },
  'order.postal': { en: 'Postal code (optional)', ur: 'پوسٹل کوڈ (اختیاری)' },
  'order.addressLine': { en: 'Address', ur: 'پتہ' },
  'order.confirmNote': { en: 'A confirmation will be sent once our team confirms your order.', ur: 'ہماری ٹیم کی تصدیق کے بعد آپ کو اطلاع بھیجی جائے گی۔' },
  'order.nothingToCheckout': { en: 'Nothing to check out', ur: 'چیک آؤٹ کے لیے کچھ نہیں' },

  // Success
  'success.thanks': { en: 'Thank you for your order', ur: 'آپ کے آرڈر کا شکریہ' },
  'success.thanksDesc': { en: "We've received your order and our team will call you shortly to confirm.", ur: 'ہمیں آپ کا آرڈر مل گیا۔ ہماری ٹیم جلد تصدیق کے لیے رابطہ کرے گی۔' },

  // Wishlist
  'wishlist.title': { en: 'Your Wishlist', ur: 'آپ کی پسندیدہ اشیاء' },
  'wishlist.saved': { en: 'Saved', ur: 'پسندیدہ' },
  'wishlist.count': { en: 'item saved', ur: 'شے محفوظ' },
  'wishlist.countPlural': { en: 'items saved', ur: 'اشیاء محفوظ' },
  'wishlist.empty': { en: 'No saved pieces yet', ur: 'ابھی کوئی شے محفوظ نہیں' },
  'wishlist.emptyDesc': { en: 'Tap the heart on any piece to save it here.', ur: 'کسی بھی شے پر دل دبائیں تاکہ وہ یہاں محفوظ ہو جائے۔' },
  'wishlist.clearAll': { en: 'Clear all', ur: 'سب خالی کریں' },

  // Contact
  'contact.title': { en: 'Contact Us', ur: 'ہم سے رابطہ کریں' },
  'contact.subtitle': { en: 'Questions about a piece, an order, or a custom design? We are happy to help.', ur: 'کسی شے، آرڈر، یا مخصوص ڈیزائن کے بارے میں سوال؟ ہم مدد کے لیے حاضر ہیں۔' },
  'contact.send': { en: 'Send', ur: 'بھیجیں' },
  'contact.sentTitle': { en: 'Message sent', ur: 'پیغام بھیج دیا گیا' },
  'contact.sentDesc': { en: 'Thank you for reaching out. Our team will get back to you shortly.', ur: 'شکریہ۔ ہماری ٹیم جلد آپ سے رابطہ کرے گی۔' },
  'contact.sendAnother': { en: 'Send another', ur: 'نیا پیغام بھیجیں' },
  'contact.showroom': { en: 'Our Showroom', ur: 'ہماری دکان' },
  'contact.reachUs': { en: 'Reach us', ur: 'ہم سے رابطہ' },
  'contact.reachDesc': { en: 'Phone, email and WhatsApp will be listed here once confirmed. For now, send us a message.', ur: 'فون، ای میل اور واٹس ایپ تصدیق کے بعد یہاں درج ہوں گے۔' },
  'contact.hours': { en: 'Showroom hours', ur: 'دکان کے اوقات' },
  'contact.hoursDesc': { en: 'Opening hours will be confirmed with the shop.', ur: 'اوقات کی تصدیق جاری ہے۔' },
  'field.name': { en: 'Name', ur: 'نام' },
  'field.email': { en: 'Email', ur: 'ای میل' },
  'field.phone': { en: 'Phone', ur: 'فون' },
  'field.message': { en: 'Message', ur: 'پیغام' },

  // Custom design
  'custom.heroTitle': { en: 'Bring us your vision. We will cast it in gold.', ur: 'اپنا خیال بتائیں، ہم اسے سونے میں ڈھالیں گے۔' },
  'custom.begin': { en: 'Begin your commission', ur: 'اپنا آرڈر شروع کریں' },
  'custom.briefTitle': { en: 'Tell us what you envision', ur: 'بتائیں آپ کیا چاہتے ہیں' },
  'custom.briefSubtitle': { en: 'A few quick steps. Save anytime.', ur: 'چند آسان مراحل۔' },
  'custom.yourBrief': { en: 'Your brief', ur: 'آپ کی تفصیل' },
  'custom.briefUpdates': { en: 'Updates as you go.', ur: 'بتدریج اپڈیٹ ہوتی ہے۔' },
  'custom.continue': { en: 'Continue', ur: 'آگے بڑھیں' },
  'custom.back': { en: 'Back', ur: 'پیچھے' },
  'custom.submit': { en: 'Submit brief', ur: 'تفصیل بھیجیں' },
  'custom.briefReceived': { en: 'Brief received', ur: 'تفصیل موصول ہو گئی' },
  'custom.vision': { en: 'Vision', ur: 'خیال' },
  'custom.details': { en: 'Details', ur: 'تفصیلات' },
  'custom.budget': { en: 'Budget', ur: 'بجٹ' },
  'custom.review': { en: 'Review', ur: 'جائزہ' },

  // Try-on
  'tryon.eyebrow': { en: 'Preview Studio', ur: 'پریویو اسٹوڈیو' },
  'tryon.title': { en: 'See it before it is yours', ur: 'خریدنے سے پہلے دیکھیں' },
  'tryon.subtitle': { en: 'Upload a photo and place a piece on it to gauge scale and style.', ur: 'تصویر اپ لوڈ کریں اور شے کو اس پر رکھ کر اندازہ لگائیں۔' },
  'tryon.realTitle': { en: 'Try on for real', ur: 'اصل میں پہن کر دیکھیں' },
  'tryon.realDesc': { en: 'The best preview is the real thing. Visit us at Sarafa Bazar, Shop 2, Multan.', ur: 'بہترین پیش نظارہ اصل شے ہے۔ ہم سے ملیں: سرافہ بازار، دکان 2، ملتان۔' },

  // About
  'about.title': { en: 'A Family of Goldsmiths', ur: 'سوناروں کا خاندان' },

  // Sections
  'section.featured': { en: 'Featured Masterpieces', ur: 'نمایاں شاہکار' },
  'section.featuredSub': { en: 'A selection of our finest pieces, each crafted from genuine gold and finished by hand.', ur: 'ہمارے بہترین نمونے، ہر ایک خالص سونے سے ہاتھ سے بنا۔' },
  'section.categories': { en: 'Shop by Category', ur: 'قسم کے مطابق منتخب کریں' },
  'section.categoriesSub': { en: 'Find gold for every occasion.', ur: 'ہر موقع کے لیے سونا تلاش کریں۔' },
  'section.promise': { en: 'Why choose Al-Wahab', ur: 'الوہاب کیوں چنیں' },
  'section.heritage': { en: 'A Family of Goldsmiths', ur: 'سوناروں کا خاندان' },

  // Categories
  'cat.rings': { en: 'Rings', ur: 'انگوٹھیاں' },
  'cat.ringsDesc': { en: 'Solitaires and bands', ur: 'نگینے اور چھلے' },
  'cat.necklaces': { en: 'Necklaces', ur: 'ہار' },
  'cat.necklacesDesc': { en: 'Chains and sets', ur: 'زنجیریں اور سیٹ' },
  'cat.bracelets': { en: 'Bracelets', ur: 'چوڑیاں' },
  'cat.braceletsDesc': { en: 'Bangles and chains', ur: 'کڑے اور زنجیریں' },
  'cat.earrings': { en: 'Earrings', ur: 'بالیاں' },
  'cat.earringsDesc': { en: 'Studs and jhumkas', ur: 'بالے اور جھمکیاں' },
  'cat.shopNow': { en: 'Shop now', ur: 'ابھی خریدیں' },

  // Footer
  'footer.tagline': { en: 'A family gold shop in Multan Sarafa Bazar. Genuine gold, hand finished, made to be inherited.', ur: 'ملتان سرافہ بازار میں خاندانی سونے کی دکان۔ خالص سونا، ہاتھ سے بناؤ۔' },
  'footer.explore': { en: 'Explore', ur: 'دریافت کریں' },
  'footer.visit': { en: 'Visit Us', ur: 'ہم سے ملیں' },
  'footer.enquire': { en: 'For enquiries, send us a message.', ur: 'معلومات کے لیے ہمیں پیغام بھیجیں۔' },
  'footer.rights': { en: 'All rights reserved.', ur: 'جملہ حقوق محفوظ ہیں۔' },
} as const

export type TKey = keyof typeof translations
