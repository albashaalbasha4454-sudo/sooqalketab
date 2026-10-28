import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowUpLeft,
  BookOpen,
  Check,
  ChevronLeft,
  Headphones,
  Heart,
  Instagram,
  Library,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from 'lucide-react'

type Product = {
  id: number
  title: string
  author: string
  category: string
  price: number
  oldPrice?: number
  badge?: string
  tone: 'olive' | 'terracotta' | 'sand' | 'ink' | 'blue' | 'rose'
  kind: 'book' | 'print'
  description: string
}

type Category = {
  label: string
  count: string
  symbol: string
  tone: string
}

const categories: Category[] = [
  { label: 'روايات عربية', count: '128 عنوانًا', symbol: '01', tone: 'category-olive' },
  { label: 'فكر وتاريخ', count: '74 عنوانًا', symbol: '02', tone: 'category-terracotta' },
  { label: 'كتب الأطفال', count: '56 عنوانًا', symbol: '03', tone: 'category-sand' },
  { label: 'مطبوعات فنية', count: '32 إصدارًا', symbol: '04', tone: 'category-ink' },
]

const products: Product[] = [
  {
    id: 1,
    title: 'مدن الملح',
    author: 'عبد الرحمن منيف',
    category: 'روايات عربية',
    price: 85000,
    badge: 'الأكثر طلبًا',
    tone: 'olive',
    kind: 'book',
    description: 'نسخة مختارة من الرواية العربية التي صنعت ذاكرة جيل كامل.',
  },
  {
    id: 2,
    title: 'رسائل إلى شاعر شاب',
    author: 'راينر ماريا ريلكه',
    category: 'فكر وتاريخ',
    price: 60000,
    oldPrice: 72000,
    badge: 'عرض الأسبوع',
    tone: 'terracotta',
    kind: 'book',
    description: 'كلمات هادئة عن الكتابة والحياة والعثور على الصوت الخاص.',
  },
  {
    id: 3,
    title: 'أطلس دمشق الصغير',
    author: 'إصدار سوق الكتاب',
    category: 'مطبوعات فنية',
    price: 110000,
    badge: 'إصدار جديد',
    tone: 'sand',
    kind: 'print',
    description: 'طباعة فنية تحتفي بتفاصيل المدينة، مناسبة للإهداء والاقتناء.',
  },
  {
    id: 4,
    title: 'الأمير الصغير',
    author: 'أنطوان دو سانت إكزوبيري',
    category: 'كتب الأطفال',
    price: 45000,
    tone: 'blue',
    kind: 'book',
    description: 'حكاية لا تكبر، برسومات وطبعة محببة للقراءة الأولى.',
  },
  {
    id: 5,
    title: 'موسم الهجرة إلى الشمال',
    author: 'الطيب صالح',
    category: 'روايات عربية',
    price: 70000,
    tone: 'ink',
    kind: 'book',
    description: 'رواية عربية خالدة عن الذاكرة والهوية والعودة.',
  },
  {
    id: 6,
    title: 'دفتر يوميات هادئة',
    author: 'ورق سوق الكتاب',
    category: 'مطبوعات فنية',
    price: 35000,
    badge: 'محدود',
    tone: 'rose',
    kind: 'print',
    description: 'دفتر عملي بغلاف متين ومساحات واسعة للأفكار والرسومات.',
  },
]

const formatPrice = (value: number) => `${new Intl.NumberFormat('ar-SY').format(value)} ل.س`

function BookCover({ product, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <div className={`book-cover cover-${product.tone} ${compact ? 'book-cover-compact' : ''}`} aria-label={`غلاف ${product.title}`}>
      <span className="cover-kicker">سوق الكتاب</span>
      <span className="cover-title">{product.title}</span>
      <span className="cover-author">{product.author}</span>
      <span className="cover-line" aria-hidden="true" />
      <span className="cover-type">{product.kind === 'book' ? 'كتاب' : 'مطبوعات'}</span>
    </div>
  )
}

function SectionHeading({ eyebrow, title, action, onAction }: { eyebrow: string; title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {action && onAction && (
        <button className="text-link" onClick={onAction}>
          {action}
          <ArrowLeft size={17} strokeWidth={1.8} />
        </button>
      )}
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [cartCount, setCartCount] = useState(0)
  const [addedId, setAddedId] = useState<number | null>(null)
  const [notice, setNotice] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'الكل' || product.category === activeCategory
      const matchesQuery = !normalized || `${product.title} ${product.author} ${product.category}`.toLowerCase().includes(normalized)
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMenuOpen(false)
  }

  const openSearch = () => {
    goTo('catalog')
    window.setTimeout(() => searchRef.current?.focus(), 350)
  }

  const addToCart = (product: Product) => {
    setCartCount((count) => count + 1)
    setAddedId(product.id)
    setNotice(`أضيف «${product.title}» إلى سلتك التجريبية`)
    window.setTimeout(() => setAddedId(null), 1800)
  }

  const showAllProducts = () => {
    setActiveCategory('الكل')
    setQuery('')
    goTo('catalog')
  }

  return (
    <div className="site-shell">
      {notice && <div className="toast" role="status"><Check size={17} />{notice}</div>}

      <div className="announcement">
        <span><Truck size={16} /> توصيل الكتب والمطبوعات إلى مختلف المحافظات السورية</span>
        <span className="announcement-note">بيانات تجريبية — نجهّز تجربة الشراء القادمة</span>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <button className="mobile-menu-button" aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
          <a href="#top" className="brand" onClick={() => goTo('top')} aria-label="سوق الكتاب، الصفحة الرئيسية">
            <span className="brand-mark"><BookOpen size={24} strokeWidth={1.7} /></span>
            <span className="brand-copy"><strong>سوق الكتاب</strong><small>رفّك الأقرب</small></span>
          </a>
          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="التنقل الرئيسي">
            <a href="#catalog" onClick={() => goTo('catalog')}>تصفح الكتب</a>
            <a href="#categories" onClick={() => goTo('categories')}>التصنيفات</a>
            <a href="#new" onClick={() => goTo('new')}>وصل حديثًا</a>
            <a href="#about" onClick={() => goTo('about')}>عن سوق الكتاب</a>
          </nav>
          <div className="header-actions">
            <button className="icon-button" aria-label="البحث" onClick={openSearch}><Search size={20} /></button>
            <button className="cart-button" onClick={() => { setNotice(cartCount ? `لديك ${cartCount} ${cartCount === 1 ? 'كتاب' : 'كتب'} في السلة التجريبية` : 'السلة جاهزة لإضافة أول كتاب'); goTo('catalog') }}>
              <ShoppingBag size={19} />
              <span>السلة</span>
              {cartCount > 0 && <b>{cartCount}</b>}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow"><Sparkles size={15} /> مختارات تصل إلى يدك</span>
              <h1>كتابٌ جديد،<br /><em>نافذةٌ أوسع.</em></h1>
              <p>ننتقي لك كتبًا ومطبوعات تحمل معنى؛ من رفوف دور النشر إلى القرّاء في كل مدينة سورية.</p>
              <div className="hero-actions">
                <button className="button button-primary" onClick={() => goTo('catalog')}>ابدأ التصفح <ArrowLeft size={18} /></button>
                <button className="button button-quiet" onClick={() => goTo('about')}>لماذا سوق الكتاب؟</button>
              </div>
              <div className="hero-proof"><span className="proof-avatars"><i>م</i><i>ر</i><i>س</i></span><span>مختارات تُقرأ وتُهدى وتبقى</span></div>
            </div>
            <div className="hero-visual" aria-label="مجموعة كتب ومطبوعات مختارة">
              <div className="hero-note"><span>مختارات هذا الشهر</span><strong>اقرأ على مهل</strong></div>
              <div className="hero-shelf shelf-back"><BookCover product={products[1]} compact /></div>
              <div className="hero-shelf shelf-front"><BookCover product={products[0]} compact /></div>
              <div className="hero-print"><span className="print-sun" /><span className="print-letter">أ</span><small>ورق<br />وفكرة</small></div>
              <div className="hero-stamp">من<br />سوريا<br />إلى سوريا</div>
              <span className="hero-scribble scribble-one">✳</span>
              <span className="hero-scribble scribble-two">· · ·</span>
            </div>
          </div>
        </section>

        <section className="benefits-strip" aria-label="مزايا سوق الكتاب">
          <div className="container benefits-grid">
            <div className="benefit"><span className="benefit-icon"><Library size={20} /></span><div><strong>اختيارات بعناية</strong><small>كتب تستحق مكانًا في رفك</small></div></div>
            <div className="benefit"><span className="benefit-icon"><Truck size={20} /></span><div><strong>توصيل داخل سوريا</strong><small>نرتبها لتصل بأمان</small></div></div>
            <div className="benefit"><span className="benefit-icon"><Headphones size={20} /></span><div><strong>نحن قريبون</strong><small>أسئلة واقتراحات بلا تعقيد</small></div></div>
          </div>
        </section>

        <section className="section categories-section" id="categories">
          <div className="container">
            <SectionHeading eyebrow="تجوّل بين الرفوف" title="ما الذي تبحث عنه اليوم؟" action="كل التصنيفات" onAction={showAllProducts} />
            <div className="categories-grid">
              {categories.map((category) => (
                <button key={category.label} className={`category-card ${category.tone}`} onClick={() => { setActiveCategory(category.label); goTo('catalog') }}>
                  <span className="category-number">{category.symbol}</span>
                  <span className="category-icon"><BookOpen size={25} strokeWidth={1.5} /></span>
                  <span className="category-label">{category.label}</span>
                  <span className="category-count">{category.count}</span>
                  <ArrowUpLeft className="category-arrow" size={20} />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section catalog-section" id="catalog">
          <div className="container">
            <SectionHeading eyebrow="مختاراتنا" title="كتب تستحق أن تبدأ بها" action="عرض الكل" onAction={showAllProducts} />
            <div className="catalog-toolbar">
              <div className="search-box"><Search size={20} /><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن كتاب، كاتب، أو موضوع..." aria-label="البحث عن كتاب" /></div>
              <div className="filter-tabs" role="group" aria-label="تصفية المنتجات">
                {['الكل', 'روايات عربية', 'فكر وتاريخ', 'كتب الأطفال', 'مطبوعات فنية'].map((category) => <button key={category} className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}
              </div>
            </div>
            {filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.slice(0, 4).map((product) => (
                  <article className="product-card" key={product.id}>
                    <div className="product-art"><BookCover product={product} />{product.badge && <span className="product-badge">{product.badge}</span>}<button className="wishlist" aria-label={`إضافة ${product.title} إلى المفضلة`} onClick={() => setNotice('أضيف الكتاب إلى قائمة الأمنيات التجريبية')}><Heart size={18} /></button></div>
                    <div className="product-content"><span className="product-category">{product.category}</span><h3>{product.title}</h3><p className="product-author">{product.author}</p><p className="product-description">{product.description}</p><div className="product-footer"><div><strong>{formatPrice(product.price)}</strong>{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</div><button className={`add-button ${addedId === product.id ? 'added' : ''}`} onClick={() => addToCart(product)}>{addedId === product.id ? <><Check size={17} /> تمت الإضافة</> : <><ShoppingBag size={17} /> أضف</>}</button></div></div>
                  </article>
                ))}
              </div>
            ) : <div className="empty-state"><Search size={28} /><strong>لم نجد هذا العنوان بعد</strong><span>جرّب اسمًا آخر أو تصفح كل المختارات.</span><button className="button button-secondary" onClick={showAllProducts}>عرض كل الكتب</button></div>}
          </div>
        </section>

        <section className="editorial-banner" id="about">
          <div className="container editorial-inner"><div className="editorial-symbol"><span>اقرأ</span><BookOpen size={26} /></div><div><span className="eyebrow">فكرة سوق الكتاب</span><h2>الكتاب الجيد لا يملأ رفًّا فقط،<br /><em>بل يترك مكانًا أوسع في الداخل.</em></h2></div><button className="circle-arrow" aria-label="اقرأ المزيد عن سوق الكتاب" onClick={() => setNotice('سنحكي قصة سوق الكتاب قريبًا')}><ArrowLeft size={22} /></button></div>
        </section>

        <section className="section new-section" id="new">
          <div className="container"><SectionHeading eyebrow="وصل حديثًا" title="إصدارات جديدة إلى الرف" action="شاهد الجديد" onAction={() => { setActiveCategory('الكل'); setQuery(''); goTo('catalog') }} /><div className="new-layout"><div className="new-feature"><div className="new-feature-copy"><span className="eyebrow">إصدار محدود</span><h3>أطلس دمشق الصغير</h3><p>تفاصيل المدينة التي نمرّ بها كل يوم، في مطبوعة فنية تحفظ الذاكرة وتليق بالجدار.</p><button className="text-link light-link" onClick={() => addToCart(products[2])}>اكتشف الإصدار <ArrowLeft size={17} /></button></div><div className="new-feature-art"><BookCover product={products[2]} /></div></div><div className="new-list">{products.slice(4, 6).map((product) => <article key={product.id} className="mini-product"><BookCover product={product} compact /><div><span className="product-category">{product.category}</span><h3>{product.title}</h3><p>{product.author}</p><strong>{formatPrice(product.price)}</strong></div><button aria-label={`أضف ${product.title} إلى السلة`} onClick={() => addToCart(product)}><ChevronLeft size={19} /></button></article>)}</div></div></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-main"><div className="footer-brand"><a href="#top" className="brand" onClick={() => goTo('top')}><span className="brand-mark"><BookOpen size={24} strokeWidth={1.7} /></span><span className="brand-copy"><strong>سوق الكتاب</strong><small>رفّك الأقرب</small></span></a><p>كتب ومطبوعات مختارة، تصل من رفوفنا إلى القرّاء في سوريا.</p><div className="socials"><button aria-label="إنستغرام" onClick={() => setNotice('رابط إنستغرام سيُضاف قريبًا')}><Instagram size={18} /></button><button aria-label="التواصل معنا" onClick={() => setNotice('قناة التواصل ستُضاف عند ربط الطلبات')}><Headphones size={18} /></button></div></div><div className="footer-column"><strong>تصفح</strong><a href="#catalog" onClick={() => goTo('catalog')}>كل الكتب</a><a href="#categories" onClick={() => goTo('categories')}>التصنيفات</a><a href="#new" onClick={() => goTo('new')}>وصل حديثًا</a></div><div className="footer-column"><strong>نساعدك</strong><a href="#about" onClick={() => goTo('about')}>عن سوق الكتاب</a><button onClick={() => setNotice('سيظهر دليل الطلب والتوصيل في المرحلة التالية')}>الطلب والتوصيل</button><button onClick={() => setNotice('سيظهر قسم الأسئلة الشائعة قريبًا')}>الأسئلة الشائعة</button></div><div className="footer-note"><span className="eyebrow">رسالة صغيرة</span><p>«كل كتاب هو بداية حديث لم يبدأ بعد.»</p><small>النسخة الأولى من متجر سوق الكتاب · سوريا</small></div></div><div className="container footer-bottom"><span>© 2026 سوق الكتاب. جميع الحقوق محفوظة.</span><span>تجربة أولية ببيانات تجريبية</span></div>
      </footer>
    </div>
  )
}

export default App
