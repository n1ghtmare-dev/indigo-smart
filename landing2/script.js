/* ═══════════════════════════════════════════════════════════
   Школа-студия красоты Ксении Аракелян — интерактив
   Все переходы плавные: ничего не появляется и не исчезает рывком.
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Год в подвале ─── */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ─── Шапка: фон при скролле ─── */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ─── Мобильное меню ─── */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const backdrop = document.getElementById('navBackdrop');

  const setNav = open => {
    nav.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  burger.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
  backdrop.addEventListener('click', () => setNav(false));
  nav.querySelectorAll('.nav__link').forEach(link => link.addEventListener('click', () => setNav(false)));

  /* ─── Слайдер первого экрана ─── */
  const slides = [...document.querySelectorAll('.hero__slide')];
  const images = [...document.querySelectorAll('.hero__img')];
  const bar = document.querySelector('.hero__bar');
  const numCurrent = document.querySelector('.hero__num[data-goto="0"]');
  const numTotal = document.querySelector('.hero__num[data-goto="2"]');

  let current = 0;
  let timer = null;

  const goTo = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    images.forEach((img, i) => img.classList.toggle('is-active', i === current));
    if (bar) bar.style.setProperty('--i', current);
    if (numCurrent) numCurrent.textContent = String(current + 1).padStart(2, '0');
  };

  // 9 секунд на слайд: смена успевает полностью «отдышаться» и не мельтешит
  const startAuto = () => {
    clearInterval(timer);
    if (!reducedMotion) timer = setInterval(() => goTo(current + 1), 9000);
  };

  if (slides.length) {
    if (numTotal) numTotal.textContent = String(slides.length).padStart(2, '0');
    [numCurrent, numTotal].forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
    });
    // пауза, пока курсор на первом экране — картинка не меняется под рукой
    const hero = document.getElementById('hero');
    if (hero) {
      hero.addEventListener('mouseenter', () => clearInterval(timer));
      hero.addEventListener('mouseleave', startAuto);
    }
    goTo(0);
    startAuto();
  }

  /* ─── Появление блоков при скролле, каскадом ─── */
  const reveals = [...document.querySelectorAll('.reveal')];

  // соседние элементы одного контейнера выходят с нарастающей задержкой
  const seen = new Map();
  reveals.forEach(el => {
    const parent = el.parentElement;
    const index = seen.get(parent) || 0;
    seen.set(parent, index + 1);
    if (index > 0) el.style.transitionDelay = Math.min(index * 0.09, 0.45) + 's';
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
        // задержка нужна только на входе, дальше она мешала бы ховерам;
        // will-change снимаем, чтобы не держать слои после анимации
        setTimeout(() => {
          entry.target.style.transitionDelay = '';
          entry.target.style.willChange = 'auto';
        }, 1600);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  /* ─── FAQ: плавное раскрытие по высоте, открыт только один пункт ─── */
  const faqItems = [...document.querySelectorAll('.faq__item')];

  const expand = item => {
    const body = item.querySelector('.faq__body');
    item.open = true;
    if (reducedMotion) return;
    body.style.height = '0px';
    requestAnimationFrame(() => { body.style.height = body.scrollHeight + 'px'; });
    body.addEventListener('transitionend', function done(e) {
      if (e.propertyName !== 'height') return;
      body.style.height = '';               // дальше высота живёт сама
      body.removeEventListener('transitionend', done);
    });
  };

  const collapse = item => {
    const body = item.querySelector('.faq__body');
    if (reducedMotion) { item.open = false; return; }
    body.style.height = body.scrollHeight + 'px';
    requestAnimationFrame(() => { body.style.height = '0px'; });
    body.addEventListener('transitionend', function done(e) {
      if (e.propertyName !== 'height') return;
      item.open = false;
      body.style.height = '';
      body.removeEventListener('transitionend', done);
    });
  };

  faqItems.forEach(item => {
    item.querySelector('summary').addEventListener('click', e => {
      e.preventDefault();                   // открываем сами, чтобы анимировать высоту
      if (item.open) { collapse(item); return; }
      faqItems.forEach(other => { if (other !== item && other.open) collapse(other); });
      expand(item);
    });
  });

  /* ─── Лайтбокс для галереи работ ─── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox__close');

  const openLightbox = src => {
    lightboxImg.src = src;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // картинку убираем только после затухания, иначе кадр пропадает рывком
    setTimeout(() => {
      if (!lightbox.classList.contains('is-open')) lightboxImg.src = '';
    }, 500);
  };

  document.querySelectorAll('.work').forEach(fig => {
    fig.addEventListener('click', () => {
      const img = fig.querySelector('img');
      if (img) openLightbox(img.currentSrc || img.src);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (lightbox.classList.contains('is-open')) closeLightbox();
    if (nav.classList.contains('is-open')) setNav(false);
  });

});
